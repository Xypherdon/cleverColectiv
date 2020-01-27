import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';

export default class Skill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            user: this.props.user,
            currentUser: this.props.currentUser,
            redirect: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
        }
    }

    redirect() {
        this.setState({ redirect: true });
    }

    render() {
        if (this.state.redirect) {
            history.push('/skills');
            return <Redirect to={`profile/${this.state.user._id}`} />;
        } else {
            let previewButton = '';
            if (
                this.state.user.role === 'Employee' ||
                this.state.user.role === 'Supervisor'
            ) {
                previewButton = (
                    <button
                        className="form-input-submit"
                        onClick={this.redirect.bind(this)}
                    >
                        {languages[this.state.language].preview}
                    </button>
                );
            }

            return (
                <span>
                    {this.state.user.firstName} {this.state.user.lastName}{' '}
                    {this.state.user.role} {this.state.user.skills}
                    <div>{previewButton}</div>
                </span>
            );
        }
    }
}
