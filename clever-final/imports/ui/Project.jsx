import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import history from '../router/history.js';
import { Requests } from '../api/requests.js';

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            project: this.props.project,
            editProject: false,
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

    editProject() {
        this.setState({ editProject: true });
    }

    cancel() {
        this.setState({ editProject: false });
    }

    handleSubmit() {
        const projectName = ReactDOM.findDOMNode(
            this.refs.projectNameInput
        ).value.trim();
        const customer = ReactDOM.findDOMNode(
            this.refs.customerInput
        ).value.trim();
        const industry = ReactDOM.findDOMNode(
            this.refs.industryInput
        ).value.trim();

        let update = {};

        if (projectName !== this.state.project.projectName) {
            update.projectName = projectName;
        }

        if (customer !== this.state.project.customer) {
            update.customer = customer;
        }

        if (industry !== this.state.project.industry) {
            update.industry = industry;
        }

        Meteor.call('projects.update', this.state.project._id, update);
        this.setState({ editProject: false });
    }

    deleteProject() {
        Meteor.call('projects.remove', this.state.project._id);
    }

    joinProject() {
        Meteor.call(
            'users.joinProject',
            this.props.currentUser._id,
            this.state.project._id
        );
    }

    render() {
        if (this.props.currentUser !== null) {
            let final = '';
            if (this.state.editProject === true) {
                final = (
                    <span className="edit-user-details-span">
                        <form
                            className="request-form"
                            onSubmit={this.handleSubmit.bind(this)}
                        >
                            <div>
                                <input
                                    ref="projectNameInput"
                                    className="form-input"
                                    type="text"
                                    placeholder={
                                        languages[this.state.language]
                                            .projectName
                                    }
                                    defaultValue={
                                        this.state.project.projectName
                                    }
                                />
                            </div>
                            <div>
                                <input
                                    ref="customerInput"
                                    className="form-input"
                                    type="text"
                                    placeholder={
                                        languages[this.state.language].customer
                                    }
                                    defaultValue={this.state.project.customer}
                                />
                            </div>
                            <div>
                                <input
                                    ref="industryInput"
                                    className="form-input"
                                    type="text"
                                    placeholder={
                                        languages[this.state.language].industry
                                    }
                                    defaultValue={this.state.project.industry}
                                />
                            </div>

                            <div>
                                <input
                                    className="form-input-submit"
                                    type="submit"
                                    defaultValue={
                                        languages[this.state.language].accept
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
                let editProjectButton = '';
                let joinProjectButton = '';

                if (
                    this.props.currentUser._id ===
                        this.state.project.projectAuthor ||
                    this.props.currentUser.role === 'Administrator'
                ) {
                    editProjectButton = (
                        <span>
                            <button
                                className="form-input-submit"
                                onClick={this.editProject.bind(this)}
                            >
                                {languages[this.state.language].edit}
                            </button>
                            <button
                                className="form-input-submit"
                                onClick={this.deleteProject.bind(this)}
                            >
                                {languages[this.state.language].delete}
                            </button>
                        </span>
                    );
                }

                if (
                    this.props.currentUser &&
                    this.props.currentUser.projects &&
                    this.props.currentUser.projects.includes(
                        this.state.project._id
                    )
                ) {
                    joinProjectButton = '';
                } else {
                    joinProjectButton = (
                        <span>
                            <button
                                className="form-input-submit"
                                onClick={this.joinProject.bind(this)}
                            >
                                Join
                            </button>
                        </span>
                    );
                }
                final = (
                    <li key={this.state.project._id}>
                        <span>
                            {languages[this.state.language].projectName}:{' '}
                            {this.state.project.projectName},{' '}
                            {languages[this.state.language].customer}:{' '}
                            {this.state.project.customer},{' '}
                            {languages[this.state.language].industry}:{' '}
                            {this.state.project.industry}{' '}
                        </span>
                        <span>id: {this.state.project._id}</span>
                        <div>
                            {editProjectButton}
                            {joinProjectButton}
                        </div>
                    </li>
                );
            }

            return final;
        } else {
            <Redirect to="/" />;
        }
    }
}
