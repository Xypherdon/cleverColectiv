import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';

export default class TimelineProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            project: this.props.project,
            currentUser: this.props.currentUser,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
            if (this.props.project) {
                this.setState({ project: this.props.project });
            }
        }
    }

    render() {
        return (
            <li key={this.state.project._id}>
                <span>
                    {languages[this.state.language].projectName}:{' '}
                    {this.state.project.projectName},{' '}
                    {languages[this.state.language].customer}:{' '}
                    {this.state.project.customer},{' '}
                    {languages[this.state.language].industry}:{' '}
                    {this.state.project.industry}{' '}
                </span>
            </li>
        );
    }
}
