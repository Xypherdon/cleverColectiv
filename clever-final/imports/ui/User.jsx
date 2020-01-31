import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';

class User extends Component {
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

    handleSubmit() {
        const emailAddress = ReactDOM.findDOMNode(
            this.refs.emailAddressInput
        ).value.trim();
        const password = ReactDOM.findDOMNode(
            this.refs.passwordInput
        ).value.trim();
        const supervisorId = ReactDOM.findDOMNode(
            this.refs.supervisorIdInput
        ).value.trim();
        const firstName = ReactDOM.findDOMNode(
            this.refs.firstNameInput
        ).value.trim();
        const lastName = ReactDOM.findDOMNode(
            this.refs.lastNameInput
        ).value.trim();
        const role = ReactDOM.findDOMNode(this.refs.roleInput).value.trim();
        const consultingLevel = ReactDOM.findDOMNode(
            this.refs.consultingLevelInput
        ).value.trim();
        const region = ReactDOM.findDOMNode(this.refs.regionInput).value.trim();
        const skillsRaw = ReactDOM.findDOMNode(
            this.refs.skillsInput
        ).value.trim();

        const skills = skillsRaw.split(',');

        Meteor.call(
            'users.update',
            { emailAddress: emailAddress },
            {
                emailAddress,
                password,
                supervisorId,
                firstName,
                lastName,
                role,
                consultingLevel,
                region,
                skills,
                projects: [],
            }
        );

        this.setState({ create: false });
    }

    cancel() {
        this.setState({ create: false });
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

    checkRole() {
        if (this.state.user.role === 'Employee') {
            return (
                <React.Fragment>
                    <option value="Employee" selected>
                        Employee
                    </option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Administrator">Administrator</option>
                </React.Fragment>
            );
        } else if (this.state.user.role === 'Supervisor') {
            return (
                <React.Fragment>
                    <option value="Employee">Employee</option>
                    <option value="Supervisor" selected>
                        Supervisor
                    </option>
                    <option value="Administrator">Administrator</option>
                </React.Fragment>
            );
        } else if (this.state.user.role === 'Administrator') {
            return (
                <React.Fragment>
                    <option value="Employee">Employee</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Administrator" selected>
                        Administrator
                    </option>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <option value="Employee">Employee</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Administrator">Administrator</option>
                </React.Fragment>
            );
        }
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
            return (
                <span className="edit-user-details-span">
                    <form
                        className="request-form"
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
                                defaultValue={this.state.user.emailAddress}
                            />
                        </div>
                        <div>
                            <input
                                ref="passwordInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language].password
                                }
                                defaultValue={this.state.user.password}
                            />
                        </div>
                        <div>
                            <input
                                placeholder={
                                    languages[this.state.language].supervisorId
                                }
                                ref="supervisorIdInput"
                                className="form-input"
                                type="text"
                                defaultValue={this.state.user.supervisorId}
                            />
                        </div>
                        <div>
                            <input
                                ref="firstNameInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language].firstName
                                }
                                defaultValue={this.state.user.firstName}
                            />
                        </div>
                        <div>
                            <input
                                ref="lastNameInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language].lastName
                                }
                                defaultValue={this.state.user.lastName}
                            />
                        </div>
                        <div>
                            <select
                                name={languages[this.state.language].role}
                                ref="roleInput"
                                className="form-input"
                                type="text"
                            >
                                {this.checkRole()}
                            </select>
                        </div>
                        <div>
                            <input
                                ref="consultingLevelInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language]
                                        .consultingLevel
                                }
                                defaultValue={this.state.user.consultingLevel}
                            />
                        </div>
                        <div>
                            <input
                                ref="regionInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language].region
                                }
                                defaultValue={this.state.user.region}
                            />
                        </div>
                        <div>
                            <input
                                ref="skillsInput"
                                className="form-input"
                                type="text"
                                placeholder={
                                    languages[this.state.language].skills
                                }
                                defaultValue={this.state.user.skills}
                            />
                        </div>

                        <div>
                            <input
                                className="form-input-submit"
                                type="submit"
                                defaultValue={
                                    languages[this.state.language].sendRequest
                                }
                            />
                            <button
                                className="form-input-submit"
                                onClick={this.cancel.bind(this)}
                            >
                                {languages[this.state.language].cancel}
                            </button>
                        </div>
                    </form>
                </span>
            );
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
            <React.Fragment>
                <td>
                    {this.state.user.firstName} {this.state.user.lastName}
                </td>
                <td>{this.state.user.role}</td>
                <td>{this.state.user._id}</td>
                <td>{adminButtons}</td>
            </React.Fragment>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(User);
