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

function ProfileChild(props) {
    let { id } = useParams();
    return <ProfilePage userId={id} language={props.language} />;
}

export var currentUserId = '';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { language: this.props.language };
    }

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route
                        path="/profile/:id"
                        children={
                            <ProfileChild language={this.state.language} />
                        }
                    />
                    <Route path="/">
                        <div className="title-div">
                            <h1>
                                {
                                    languages[this.state.language].loginPage
                                        .welcome
                                }
                            </h1>
                            <LoginButtons language={this.props.language} />
                        </div>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
