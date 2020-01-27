import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            user: this.props.user,
            key: this.props.key,
            editUser: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
        }
    }

    editUser() {
        this.setState({ editUser: true });
    }

    render() {
        console.log('state', this.state);
        if (this.state.editUser) {
            return <Redirect to={`/profile/${this.state.user._id._str}`} />;
        }
        return (
            <li key={this.props.key}>
                <span>
                    {languages[this.state.language].name}:{' '}
                    {this.state.user.firstName} {this.state.user.lastName},{' '}
                    {languages[this.state.language].role}:{' '}
                    {this.state.user.role}{' '}
                </span>
                <span>id: {this.state.user._id._str}</span>
                <button
                    className="form-input-submit"
                    onClick={this.editUser.bind(this)}
                >
                    {languages[this.state.language].edit}
                </button>
            </li>
        );
    }
}
