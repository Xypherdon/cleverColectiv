import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Users = new Mongo.Collection('users');
Meteor.methods({
    'users.login'(emailAddress, password) {
        check(emailAddress, String);
        check(password, String);
        const user = Users.findOne({
            emailAddress: emailAddress,
        });

        console.log('User:', user);

        if (user.locked == true) {
            return 'user_locked';
        }

        let attemptsFailed = user.attemptsFailed;

        if (attemptsFailed > 3) {
            Users.upsert({ _id: user._id }, { locked: true });
            return 'too_many_attempts';
        }

        if (password !== user.password) {
            attemptsFailed++;
            Users.upsert({ _id: user._id }, { attemptsFailed: attemptsFailed });
            return 'wrong_password';
        }
    },
});
