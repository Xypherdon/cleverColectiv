import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Pictures = new Mongo.Collection('pictures');

if (Meteor.isServer) {
    Meteor.publish('pictures', function userPublication() {
        return Pictures.find({});
    });
}

Meteor.methods({
    'pictures.insert'(pictures) {
        Pictures.insert(pictures);
    },
    'pictures.remove'(userId) {
        Pictures.remove({ userId: userId });
    },
    'pictures.update'(_id, update) {
        Pictures.update(_id, { $set: update });
    },
    'pictures.upsert'(picture) {
        Pictures.upsert(
            { userId: picture.userId },
            { $set: { data: picture.data } }
        );
    },
    'pictures.findOne'(_id) {
        return Pictures.findOne(_id);
    },
});
