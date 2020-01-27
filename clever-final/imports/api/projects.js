import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
    Meteor.publish('projects', function userPublication() {
        return Projects.find({});
    });
}

Meteor.methods({
    'projects.insert'(project) {
        Projects.insert(project);
    },
    'projects.remove'(_id) {
        Projects.remove(_id);
    },
    'projects.update'(_id, update) {
        Projects.update(_id, { $set: update });
    },
    'projects.findOne'(_id) {
        return Projects.findOne(_id);
    },
});
