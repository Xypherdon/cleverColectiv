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
            currentUser: this.props.currentUser,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.users) {
                this.setState({
                    user: this.props.users.find(
                        user => user._id === this.props.userId
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
        if (this.props.currentUser.role === 'Administrator') {
            let pendingRequests = this.props.requests.filter(
                request => request.status === 'pending'
            );
            if (pendingRequests.length === 0) {
                return (
                    <h1 className="title-div">
                        {languages[this.state.language].requestsEmpty} :)
                    </h1>
                );
            }

            return pendingRequests.map(request => {
                let requestAuthor = this.props.users.find(
                    user => user._id === request.userId
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

        let filteredRequests = this.props.requests.filter(
            request =>
                request.supervisorId === this.state.user._id &&
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
                user => user._id === request.userId
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
