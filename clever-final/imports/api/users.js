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

        const users = Users.find({}).fetch();

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
        return Users.findOne(_id);
    },
    'users.update'(_id, updateData) {
        Users.update(_id, { $set: updateData });
    },
    'users.insert'(user) {
        Users.insert(user);
    },
    'users.remove'(_id) {
        Users.remove(_id);
    },
    'users.joinProject'(_id, projectId) {
        Users.update(_id, { $push: { projects: projectId } });
    },
});
