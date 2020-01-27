import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import history from '../router/history.js';
import languages from '../lang/languages.json';
import { withTracker } from 'meteor/react-meteor-data';
import { Projects } from '../api/projects.js';
import User from './User.jsx';
import { Mongo } from 'meteor/mongo';
import Project from './Project.jsx';

class ProjectsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            create: false,
            currentUser: this.props.currentUser,
        };
    }

    componentDidMount() {
        this.componentDidUpdate({});
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
        }
    }

    renderProjects() {
        return this.props.projects.map((project, key) => (
            <Project
                language={this.state.language}
                project={project}
                currentUser={this.props.currentUser}
                key={key}
            />
        ));
    }

    handleSubmit(event) {
        event.preventDefault();
        const projectName = ReactDOM.findDOMNode(
            this.refs.projectNameInput
        ).value.trim();
        const customer = ReactDOM.findDOMNode(
            this.refs.customerInput
        ).value.trim();
        const industry = ReactDOM.findDOMNode(
            this.refs.industryInput
        ).value.trim();

        Meteor.call('projects.insert', {
            projectName,
            customer,
            industry,
            projectAuthor: this.props.currentUser._id,
        });

        this.setState({ create: false });
    }

    cancel() {
        this.setState({ create: false });
    }

    createProjectToggle() {
        this.setState({ create: !this.state.create });
    }

    render() {
        let final = '';
        console.log(this.props);
        if (this.state.create) {
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
                                    languages[this.state.language].projectName
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
        } else {
            final = (
                <div>
                    <button
                        onClick={this.createProjectToggle.bind(this)}
                        className="form-input-submit"
                    >
                        {languages[this.state.language].createProject}
                    </button>

                    <ul>{this.renderProjects()}</ul>
                </div>
            );
        }
        return final;
    }
}

export default withTracker(() => {
    Meteor.subscribe('projects');

    return {
        projects: Projects.find().fetch(),
    };
})(ProjectsPage);
