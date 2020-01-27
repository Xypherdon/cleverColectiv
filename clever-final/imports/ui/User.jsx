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
            currentUser: this.props.currentUser,
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
    deleteUser() {
        Meteor.call('users.remove', this.state.user._id);
    }

    unlock() {
        Meteor.call('users.update', this.state.user._id, { attemptsFailed: 0 });
    }

    resetPassword() {
        const newPassword = ReactDOM.findDOMNode(
            this.refs.passwordChangeInput
        ).value.trim();

        if (newPassword) {
            Meteor.call('users.update', this.state.user._id, {
                password: newPassword,
            });
            ReactDOM.findDOMNode(this.refs.passwordChangeInput).value = '';
        }
    }

    render() {
        if (this.state.editUser) {
            history.push(`/admin/${this.props.currentUser._id}`);
            return <Redirect to={`/profile/${this.state.user._id}`} />;
        }
        let adminButtons = '';
        if (this.state.user && this.state.user.role !== 'Administrator') {
            adminButtons = (
                <div>
                    <button
                        className="form-input-submit"
                        onClick={this.editUser.bind(this)}
                    >
                        {languages[this.state.language].edit}
                    </button>
                    <button
                        className="form-input-submit"
                        onClick={this.deleteUser.bind(this)}
                    >
                        {languages[this.state.language].delete}
                    </button>
                    <button
                        onClick={this.unlock.bind(this)}
                        className="form-input-submit"
                    >
                        {languages[this.state.language].unlock}
                    </button>
                    <button
                        onClick={this.resetPassword.bind(this)}
                        className="form-input-submit"
                    >
                        {languages[this.state.language].resetPassword}
                    </button>
                    <input
                        type="password"
                        className="password-change-input"
                        ref="passwordChangeInput"
                        placeholder={languages[this.state.language].newPassword}
                    />
                </div>
            );
        }
        return (
            <div>
                <li key={this.props.key}>
                    <span>
                        {languages[this.state.language].name}:{' '}
                        {this.state.user.firstName} {this.state.user.lastName},{' '}
                        {languages[this.state.language].role}:{' '}
                        {this.state.user.role}{' '}
                    </span>
                    <span>id: {this.state.user._id}</span>
                </li>
                {adminButtons}
            </div>
        );
    }
}
