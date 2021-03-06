/**
 * @prettier
 */

import React, { Component } from 'react';
import Hello from './Hello.jsx';
import Info from './Info.jsx';
import { Router, Switch, Route, Link, useParams } from 'react-router-dom';
import LoginButtons from './LoginButtons.jsx';
import ProfilePage from './ProfilePage.jsx';
import history from '../router/history.js';
import languages from '../lang/languages.json';
import RequestsPage from './RequestsPage.jsx';
import AdminPage from './AdminPage.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../api/users.js';
import SkillsPage from './SkillsPage.jsx';

function ProfileChild(props) {
    let { id } = useParams();
    return (
        <ProfilePage
            userId={id}
            currentUser={props.currentUser}
            language={props.language}
        />
    );
}

function RequestsChild(props) {
    let { id } = useParams();
    return (
        <RequestsPage
            userId={id}
            currentUser={props.currentUser}
            language={props.language}
        />
    );
}

function AdminChild(props) {
    let { id } = useParams();
    return (
        <AdminPage
            userId={id}
            currentUser={props.currentUser}
            language={props.language}
        />
    );
}

export var currentUserId = '';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: 'english',
            currentUser: null,
            loggedIn: false,
        };
    }
    changeLanguage(language) {
        this.setState({ language: language });
    }

    componentDidMount() {
        this.setState({
            currentUser: JSON.parse(window.localStorage.getItem('currentUser')),
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.state.currentUser) {
                let updatedCurrentUser = this.props.users.find(
                    user => user._id === this.state.currentUser._id
                );

                window.localStorage.setItem(
                    'currentUser',
                    JSON.stringify(updatedCurrentUser)
                );
                this.setState({
                    currentUser: updatedCurrentUser,
                });
            }
        }
    }

    logout() {
        window.localStorage.clear();
        this.setState({ loggedIn: false });
        location.reload();
    }

    setCurrentUser(currentUser) {
        let lightCurrentUser = currentUser;
        delete lightCurrentUser.profilePicture;
        window.localStorage.setItem(
            'currentUser',
            JSON.stringify(lightCurrentUser)
        );
        this.setState({
            currentUser: this.props.users.find(
                user => user._id === currentUser._id
            ),
            loggedIn: true,
        });
    }

    render() {
        let logoutButton = '';

        if (this.state.currentUser) {
            logoutButton = (
                <button
                    className="logout-button"
                    onClick={this.logout.bind(this)}
                >
                    {languages[this.state.language].logout}
                </button>
            );
        }

        return (
            <div>
                <div>
                    <Router history={history}>
                        <Switch>
                            <Route
                                path="/requests/:id"
                                children={
                                    <RequestsChild
                                        language={this.state.language}
                                        currentUser={this.state.currentUser}
                                    />
                                }
                            />
                            <Route
                                path="/profile/:id"
                                children={
                                    <ProfileChild
                                        language={this.state.language}
                                        currentUser={this.state.currentUser}
                                    />
                                }
                            />
                            <Route
                                path="/admin/:id"
                                children={
                                    <AdminChild
                                        language={this.state.language}
                                        currentUser={this.state.currentUser}
                                    />
                                }
                            />
                            <Route path="/projects">
                                <ProjectsPage
                                    language={this.state.language}
                                    currentUser={this.state.currentUser}
                                />
                            </Route>
                            <Route path="/skills">
                                <SkillsPage
                                    language={this.state.language}
                                    currentUser={this.state.currentUser}
                                />
                            </Route>
                            <Route
                                exact
                                path="/"
                                exact
                                render={() => {
                                    return (
                                        <div className="title-div">
                                            <h1>
                                                {
                                                    languages[
                                                        this.state.language
                                                    ].welcome
                                                }
                                            </h1>
                                            <LoginButtons
                                                language={this.state.language}
                                                currentUser={
                                                    this.state.currentUser
                                                }
                                                setCurrentUser={this.setCurrentUser.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    );
                                }}
                            ></Route>
                        </Switch>
                    </Router>
                </div>
                <div className="logout-button-div">{logoutButton}</div>
                <div className="language-div">
                    <span className="language-button">
                        <button
                            className="language-button"
                            onClick={() => this.changeLanguage('english')}
                        >
                            {languages[this.state.language].english}
                        </button>
                        <span> | </span>
                        <button
                            className="language-button"
                            onClick={() => this.changeLanguage('german')}
                        >
                            {languages[this.state.language].german}
                        </button>
                        <span> | </span>
                        <button
                            className="language-button"
                            onClick={() => this.changeLanguage('romanian')}
                        >
                            {languages[this.state.language].romanian}
                        </button>
                    </span>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(App);
