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
import Project from './Project.jsx';
import Skill from './Skill.jsx';

class SkillsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            currentUser: this.props.currentUser,
            searchValue: '',
            users: [],
        };
    }

    componentDidMount() {
        this.componentDidUpdate({});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            if (this.props.language) {
                this.setState({ language: this.props.language });
            }
            if (this.props.users) {
                this.setState({
                    users: this.props.users,
                });
            }
        }

        if (prevState && this.state.searchValue !== prevState.searchValue) {
            if (this.props.users) {
                this.setState({
                    users: this.props.users.filter(user => {
                        if (!this.state.searchValue) {
                            return true;
                        } else {
                            for (let skill in user.skills) {
                                if (
                                    user.skills[skill].startsWith(
                                        this.state.searchValue
                                    )
                                ) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }),
                });
            }
        }
    }

    handleChange(event) {
        const searchValue = ReactDOM.findDOMNode(
            this.refs.searchInput
        ).value.trim();

        this.setState({ searchValue: searchValue });
    }

    renderUsers() {
        return this.state.users.map(user => (
            <li key={user._id}>
                <Skill
                    language={this.state.language}
                    user={user}
                    currentUser={this.props.currentUser}
                />
            </li>
        ));
    }

    render() {
        return (
            <div>
                <input
                    type="text"
                    ref="searchInput"
                    className="form-input"
                    onChange={this.handleChange.bind(this)}
                    placeholder={languages[this.state.language].searchSkill}
                ></input>
                <ul>{this.renderUsers()}</ul>
            </div>
        );
    }
}
export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(SkillsPage);
