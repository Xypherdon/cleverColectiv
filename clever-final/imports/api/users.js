import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
    Meteor.publish('users', function userPublication() {
        return Users.find({}, { password: 0 });
    });
}

Meteor.methods({
    'users.login'(emailAddress, password) {
        if (Meteor.isServer) {
            check(emailAddress, String);
            check(password, String);

            console.log(emailAddress);

            const user = Users.findOne({
                emailAddress: emailAddress,
            });

            console.log('User:', user);

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

            Users.update({ _id: user._id }, { $set: { online: true } });

            return user._id;
        }
    },
});
