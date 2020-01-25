import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';

class ProfilePage extends Component {
    render() {
        return (
            <div>
                <h1>PROFILE PAGE for user:{this.props.userId}</h1>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find({}).fetch(),
    };
})(ProfilePage);
