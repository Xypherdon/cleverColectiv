import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import history from '../router/history.js';
import languages from '../lang/languages.json';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../api/users.js';
import User from './User.jsx';
import { Mongo } from 'meteor/mongo';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            create: false,
            user: { skills: [] },
            currentUser: this.props.currentUser,
            redirect: false,
        };
    }

    componentDidMount() {
        this.componentDidUpdate({});
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.users) {
                this.setState({
                    user: this.props.users.find(
                        user => user._id === this.props.userId
                    ),
                });
            }
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
        }
    }

    renderUsers() {
        return this.props.users.map((user, key) => (
            <tr key={key}>
                <User
                    language={this.state.language}
                    user={user}
                    currentUser={this.props.currentUser}
                    key={key}
                />
            </tr>
        ));
    }

    handleSubmit(event) {
        event.preventDefault();
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

        Meteor.call('users.insert', {
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
        });

        this.setState({ create: false });
    }

    cancel() {
        this.setState({ create: false });
    }

    createUserToggle() {
        this.setState({ create: !this.state.create });
    }

    redirect(to) {
        this.setState({ redirect: to });
    }

    render() {
        if (
            this.props.currentUser &&
            this.props.currentUser.role === 'Administrator'
        ) {
            if (this.state.redirect === 'requests') {
                history.push(`/admin/${this.props.currentUser._id}`);
                return (
                    <Redirect to={`/requests/${this.props.currentUser._id}`} />
                );
            }
            if (this.state.redirect === 'projects') {
                history.push(`/admin/${this.props.currentUser._id}`);
                return <Redirect to="/projects" />;
            }
            if (this.state.redirect === 'skills') {
                history.push(`/admin/${this.props.currentUser._id}`);
                return <Redirect to="/skills" />;
            }
            let final = '';
            if (this.state.create) {
                final = (
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
                                        languages[this.state.language]
                                            .emailAddress
                                    }
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
                                />
                            </div>
                            <div>
                                <input
                                    ref="supervisorIdInput"
                                    className="form-input"
                                    type="text"
                                    placeholder={
                                        languages[this.state.language]
                                            .supervisorId
                                    }
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
                                />
                            </div>
                            <div>
                                <input
                                    ref="roleInput"
                                    className="form-input"
                                    type="text"
                                    placeholder={
                                        languages[this.state.language].role
                                    }
                                />
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
                                />
                            </div>

                            <div>
                                <input
                                    className="form-input-submit"
                                    type="submit"
                                    defaultValue={
                                        languages[this.state.language]
                                            .sendRequest
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
            } else {
                final = (
                    <div>
                        <button
                            onClick={this.createUserToggle.bind(this)}
                            className="form-input-submit"
                        >
                            {languages[this.state.language].createUser}
                        </button>
                        <button
                            className="form-input-submit"
                            onClick={() => {
                                this.redirect('requests');
                            }}
                        >
                            {languages[this.state.language].requests}
                        </button>
                        <button
                            className="form-input-submit"
                            onClick={() => {
                                this.redirect('skills');
                            }}
                        >
                            {languages[this.state.language].skills}
                        </button>
                        <button
                            className="form-input-submit"
                            onClick={() => {
                                this.redirect('projects');
                            }}
                        >
                            {languages[this.state.language].projects}
                        </button>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        {languages[this.state.language].name}
                                    </th>
                                    <th>
                                        {languages[this.state.language].role}
                                    </th>
                                    <th>id</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>{this.renderUsers()}</tbody>
                        </table>
                    </div>
                );
            }
            return final;
        } else {
            if (this.props.currentUser) {
                return (
                    <Redirect to={`/profile/${this.props.currentUser._id}`} />
                );
            } else {
                return <Redirect to="/" />;
            }
        }
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(AdminPage);
