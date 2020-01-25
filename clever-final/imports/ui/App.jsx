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

function ProfileChild() {
    let { id } = useParams();
    return <ProfilePage userId={id} />;
}

export var currentUserId = '';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({ language: this.props.language });
    }

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/profile/:id" children={<ProfileChild />} />
                    <Route path="/">
                        <div className="title-div">
                            <h1>Welcome to Clever!</h1>
                            <LoginButtons />
                        </div>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
