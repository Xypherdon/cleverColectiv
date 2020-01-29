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
import PieChart from 'react-minimal-pie-chart';

class SkillsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: this.props.language,
            currentUser: this.props.currentUser,
            searchValue: '',
            users: [],
            skills: {},
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
                this.loadSkills();
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

    loadSkills() {
        this.props.users.forEach(user => {
            for (let skill in user.skills) {
                if (!this.state.skills[user.skills[skill]]) {
                    this.state.skills[user.skills[skill]] = 1;
                } else {
                    this.state.skills[user.skills[skill]]++;
                }
            }
        });
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    renderPieChart() {
        return Object.entries(this.state.skills).map(
            ([key, value], uniqueKey) => {
                return {
                    title: key,
                    value: value,
                    color: this.getRandomColor(),
                };
            }
        );
    }

    renderPieChartText(data) {
        return data.map(skill => {
            return <h5 style={{ color: skill.color }}>{skill.title}</h5>;
        });
    }

    render() {
        let pieChartData = this.renderPieChart();
        let pieChartText = this.renderPieChartText(pieChartData);
        return (
            <span>
                <span className="skill-page-left">
                    <div>
                        <input
                            type="text"
                            ref="searchInput"
                            className="form-input"
                            onChange={this.handleChange.bind(this)}
                            placeholder={
                                languages[this.state.language].searchSkill
                            }
                        />
                        <ul>{this.renderUsers()}</ul>
                    </div>
                </span>
                <span className="skill-page-right">
                    <span className="pie-chart-text">{pieChartText}</span>
                    <span className="pie-chart">
                        <PieChart label={true} data={pieChartData} />
                    </span>
                </span>
            </span>
        );
    }
}
export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(SkillsPage);
