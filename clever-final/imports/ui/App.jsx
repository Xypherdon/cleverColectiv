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
        this.state = { language: 'english', currentUser: null };
    }
    changeLanguage(language) {
        this.setState({ language: language });
    }

    setCurrentUser(currentUser) {
        this.setState({ currentUser: currentUser });
    }

    render() {
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
                            <Route path="/">
                                <div className="title-div">
                                    <h1>
                                        {languages[this.state.language].welcome}
                                    </h1>
                                    <LoginButtons
                                        language={this.state.language}
                                        setCurrentUser={this.setCurrentUser.bind(
                                            this
                                        )}
                                    />
                                </div>
                            </Route>
                        </Switch>
                    </Router>
                </div>
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

export default App;
