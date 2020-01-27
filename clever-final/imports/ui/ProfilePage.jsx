import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            currentUser: this.props.currentUser,
            user: { skills: [] },
            edit: false,
            redirect: false,
            userId: this.props.userId,
        };
    }
    componentDidMount() {
        this.componentDidUpdate({});
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

    arraysAreEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    editProfile() {
        this.setState({ edit: true });
    }
    cancel() {
        this.setState({ edit: false });
    }

    handleSubmit() {
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

        let skills = skillsRaw.split(',');

        let request = {};

        if (this.state.user.firstName !== firstName) {
            request.firstname = firstName;
        }

        if (this.state.user.lastName !== lastName) {
            request.lastName = lastName;
        }

        if (this.state.user.role !== role) {
            request.role = role;
        }

        if (this.state.user.consultingLevel !== consultingLevel) {
            request.consultingLevel = consultingLevel;
        }

        if (this.state.user.region !== region) {
            request.region = region;
        }

        if (!this.arraysAreEqual(skills, this.state.user.skills)) {
            request.skills = skills;
        }

        if (
            this.props.currentUser.role === 'Supervisor' ||
            this.props.currentUser.role === 'Administrator'
        ) {
            Meteor.call('users.update', this.state.user._id, request);
        } else {
            Meteor.call('requests.insert', request, this.state.user);
        }
    }

    redirect(to) {
        this.setState({ redirect: to });
    }

    render() {
        if (
            this.props.currentUser !== null &&
            (this.props.currentUser.role === 'Supervisor' ||
                this.props.currentUser.role === 'Administrator' ||
                this.state.userId === this.props.currentUser._id)
        ) {
            if (this.state.redirect === 'requests') {
                history.push(`/profile/${this.state.userId}`);
                return <Redirect to={`/requests/${this.state.userId}`} />;
            }
            if (this.state.redirect === 'projects') {
                history.push(`/profile/${this.state.userId}`);
                return <Redirect to="/projects" />;
            }
            if (this.state.redirect === 'skills') {
                history.push(`/profile/${this.state.userId}`);
                return <Redirect to="/skills" />;
            }
            let final = '';
            if (this.state.user) {
                if (this.state.edit) {
                    final = (
                        <span className="edit-user-details-span">
                            <form
                                className="request-form"
                                onSubmit={this.handleSubmit.bind(this)}
                            >
                                <div>
                                    <input
                                        ref="firstNameInput"
                                        className="form-input"
                                        type="text"
                                        placeholder={
                                            languages[this.state.language]
                                                .firstName
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
                                            languages[this.state.language]
                                                .lastName
                                        }
                                        defaultValue={this.state.user.lastName}
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
                                        defaultValue={this.state.user.role}
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
                                        defaultValue={
                                            this.state.user.consultingLevel
                                        }
                                    />
                                </div>
                                <div>
                                    <input
                                        ref="regionInput"
                                        className="form-input"
                                        type="text"
                                        placeholder={
                                            languages[this.state.language]
                                                .region
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
                                            languages[this.state.language]
                                                .skills
                                        }
                                        defaultValue={this.state.user.skills}
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
                    let supervisorButtons = '';
                    if (
                        this.state.user.role === 'Supervisor' &&
                        this.props.currentUser._id === this.state.userId
                    ) {
                        supervisorButtons = (
                            <div>
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
                            </div>
                        );
                    }

                    let personalButtons = '';
                    if (
                        this.props.currentUser._id == this.state.userId ||
                        this.props.currentUser.role === 'Administrator'
                    ) {
                        personalButtons = (
                            <div>
                                <button
                                    className="form-input-submit"
                                    onClick={this.editProfile.bind(this)}
                                >
                                    {languages[this.state.language].edit}
                                </button>
                                <button
                                    className="form-input-submit"
                                    onClick={() => {
                                        this.redirect('projects');
                                    }}
                                >
                                    {languages[this.state.language].projects}
                                </button>
                            </div>
                        );
                    }
                    final = (
                        <div>
                            <span className="user-details-span">
                                <h4 className="profile-identifier">
                                    {languages[this.state.language].name}
                                </h4>
                                <h2 className="profile-value">
                                    {this.state.user.firstName}{' '}
                                    {this.state.user.lastName}
                                </h2>
                                <h4 className="profile-identifier">
                                    {languages[this.state.language].role}
                                </h4>
                                <h2 className="profile-value">
                                    {this.state.user.role}
                                </h2>
                                <h4 className="profile-identifier">
                                    {
                                        languages[this.state.language]
                                            .consultingLevel
                                    }
                                </h4>
                                <h2 className="profile-value">
                                    {this.state.user.consultingLevel}
                                </h2>
                                <h4 className="profile-identifier">
                                    {languages[this.state.language].region}
                                </h4>
                                <h2 className="profile-value">
                                    {this.state.user.region}
                                </h2>
                                <h4 className="profile-identifier">
                                    {languages[this.state.language].skills}
                                </h4>
                                <h2 className="profile-value">
                                    {this.state.user.skills.map(
                                        (skill, key) => (
                                            <div key={key}>{skill}</div>
                                        )
                                    )}
                                </h2>
                                {personalButtons}
                                {supervisorButtons}
                            </span>
                            <span className="user-timeline-span">TIMELINE</span>
                        </div>
                    );
                }
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
})(ProfilePage);
