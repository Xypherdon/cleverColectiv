import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Requests = new Mongo.Collection('requests');

if (Meteor.isServer) {
    Meteor.publish('requests', function userPublication() {
        return Requests.find({});
    });
}

Meteor.methods({
    'requests.insert'(request, user) {
        Requests.insert({
            userId: user._id,
            status: 'pending',
            supervisorId: user.supervisorId,
            requestData: request,
        });
    },
    'requests.accept'(requestId) {
        Requests.update(requestId, { $set: { status: 'accepted' } });
    },
    'requests.refuse'(requestId) {
        Requests.update(requestId, { $set: { status: 'refused' } });
    },
});
