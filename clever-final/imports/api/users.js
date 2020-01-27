import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
    Meteor.publish('users', function userPublication() {
        return Users.find({});
    });
}

Meteor.methods({
    'users.login'(emailAddress, password) {
        check(emailAddress, String);
        check(password, String);

        const user = Users.findOne({
            emailAddress: emailAddress,
        });

        if (!user) {
            return 'error';
        }

        let attemptsFailed = user.attemptsFailed;

        if (attemptsFailed > 3) {
            return 'user_locked';
        }

        if (password !== user.password) {
            attemptsFailed++;
            Users.update(
                { _id: user._id },
                { $set: { attemptsFailed: attemptsFailed } }
            );
            return 'wrong_password';
        }

        Users.update(
            { _id: user._id },
            { $set: { online: true, attemptsFailed: 0 } }
        );

        return user;
    },
    'users.findOne'(_id) {
        user = Users.findOne(_id);
        return user;
    },
    'users.update'(_id, updateData) {
        Users.update(_id, { $set: updateData });
    },
    'users.insert'(user) {
        Users.insert(user);
    },
});
