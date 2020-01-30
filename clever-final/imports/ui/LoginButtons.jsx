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
            currentUser: this.props.currentUser,
            language: this.props.language,
            setCurrentUser: this.props.setCurrentUser,
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
        console.log('attemtLogin inside');
        Meteor.call('users.login', emailAddress, password, (error, result) => {
            if (error) {
                console.log('A intrat in error');
                console.log(error);
            }
            console.log('users.login Result');

            callback(result);
        });
    }

    handleSubmit(event) {
        console.log('this.props', this.props.currentUser);
        event.preventDefault();
        const emailAddress = ReactDOM.findDOMNode(
            this.refs.emailAddressInput
        ).value.trim();

        const password = ReactDOM.findDOMNode(
            this.refs.passwordInput
        ).value.trim();

        this.setState({ errorMessage: 'handleSubmit inside' });

        this.attemptLogin(emailAddress, password, result => {
            console.log('attemtLogin result', result);
            if (result === 'user_locked') {
                this.setState({
                    errorMessage: languages[this.state.language].user_locked,
                });
            } else if (result === 'wrong_password') {
                this.setState({
                    errorMessage: languages[this.state.language].wrong_password,
                });
            } else if (result === 'error') {
                this.setState({
                    errorMessage: languages[this.state.language].error,
                });
            } else {
                this.state.setCurrentUser(result);
                this.setState({ user: result });
            }
        });
    }
    render() {
        if (this.props.currentUser) {
            if (this.props.currentUser.role === 'Administrator') {
                history.push('/');
                return <Redirect to={`/admin/${this.props.currentUser._id}`} />;
            }
            if (this.props.currentUser._id) {
                history.push('/');
                return (
                    <Redirect to={`/profile/${this.props.currentUser._id}`} />
                );
            }
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
                                languages[this.state.language].emailAddress
                            }
                        />
                    </div>
                    <div>
                        <input
                            ref="passwordInput"
                            className="form-input"
                            type="password"
                            placeholder={
                                languages[this.state.language].password
                            }
                        />
                    </div>
                    <div>
                        <input
                            className="form-input-submit"
                            type="submit"
                            value={languages[this.state.language].login}
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
