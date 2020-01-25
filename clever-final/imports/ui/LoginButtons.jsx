import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class LoginButtons extends Component {
    handleSubmit(event) {
        event.preventDefault();
        const emailAddress = ReactDOM.findDOMNode(
            this.refs.emailAddressInput
        ).value.trim();

        const password = ReactDOM.findDOMNode(
            this.refs.passwordInput
        ).value.trim();

        Meteor.call('users.login', emailAddress, password, (error, result) => {
            if (result === 'user_locked') {
            }
        });
    }
    render() {
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
                            placeholder="E-mail address"
                        />
                    </div>
                    <div>
                        <input
                            ref="passwordInput"
                            className="form-input"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <input
                            className="form-input-submit"
                            type="submit"
                            value="Login"
                        />
                    </div>
                    <div>
                        <h5 className="error-message">Error</h5>
                    </div>
                </form>
            </div>
        );
    }
}
