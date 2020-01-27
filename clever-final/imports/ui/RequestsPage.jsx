import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';
import Request from './Request.jsx';
class RequestsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            user: { skills: [] },
            language: this.props.language,
            requests: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.users) {
                this.setState({
                    user: this.props.users.find(
                        user => user._id._str === this.props.userId
                    ),
                });
            }
            if (this.props.requests) {
                this.setState({
                    requests: this.props.requests.filter(
                        request =>
                            request.supervisorId !==
                            new Mongo.ObjectID(this.state.userId)
                    ),
                });
            }
            if (this.props.language) {
                this.setState({
                    language: this.props.language,
                });
            }
        }
    }

    renderRequests() {
        let filteredRequests = this.state.requests.filter(
            request =>
                request.supervisorId._str === this.state.user._id._str &&
                request.status === 'pending'
        );

        if (filteredRequests.length === 0) {
            return (
                <h1 className="title-div">
                    {languages[this.state.language].requestsEmpty} :)
                </h1>
            );
        }

        return filteredRequests.map(request => {
            let requestAuthor = this.props.users.find(
                user => user._id._str === request.userId._str
            );

            return (
                <Request
                    key={request._id}
                    request={request}
                    requestAuthor={requestAuthor}
                    language={this.state.language}
                />
            );
        });
    }

    render() {
        return (
            <div>
                <ul>{this.renderRequests()}</ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('requests');

    return {
        users: Users.find().fetch(),
        requests: Requests.find().fetch(),
    };
})(RequestsPage);
