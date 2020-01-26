import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import history from '../router/history.js';
import languages from '../lang/languages.json';

export default class LoginButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            currentUserId: '',
            language: this.props.language,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.language) {
                this.setState({
                    language: this.props.language,
                });
            }
        }
    }

    attemptLogin(emailAddress, password, callback) {
        Meteor.call('users.login', emailAddress, password, (error, result) => {
            if (error) console.log(error);
            callback(result);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const emailAddress = ReactDOM.findDOMNode(
            this.refs.emailAddressInput
        ).value.trim();

        const password = ReactDOM.findDOMNode(
            this.refs.passwordInput
        ).value.trim();

        this.attemptLogin(emailAddress, password, result => {
            if (result === 'user_locked') {
                this.setState({
                    errorMessage:
                        languages[this.state.language].loginPage.user_locked,
                });
            } else if (result === 'wrong_password') {
                this.setState({
                    errorMessage:
                        languages[this.state.language].loginPage.wrong_password,
                });
            } else if (result === 'error') {
                this.setState({
                    errorMessage:
                        languages[this.state.language].loginPage.error,
                });
            } else {
                this.setState({ currentUserId: result });
            }
        });
    }
    render() {
        if (this.state.currentUserId) {
            history.push('/');
            return <Redirect to={`profile/${this.state.currentUserId._str}`} />;
        }
        return (
            <div>
                <form
                    className="login-form"
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <div>
                        <input
                            ref="emailAddressInput"
                            className="form-input"
                            type="text"
                            placeholder={
                                languages[this.state.language].loginPage
                                    .emailAddress
                            }
                        />
                    </div>
                    <div>
                        <input
                            ref="passwordInput"
                            className="form-input"
                            type="password"
                            placeholder={
                                languages[this.state.language].loginPage
                                    .password
                            }
                        />
                    </div>
                    <div>
                        <input
                            className="form-input-submit"
                            type="submit"
                            value={
                                languages[this.state.language].loginPage.login
                            }
                        />
                    </div>
                    <div>
                        <h5 className="error-message">
                            {this.state.errorMessage}
                        </h5>
                    </div>
                </form>
            </div>
        );
    }
}
