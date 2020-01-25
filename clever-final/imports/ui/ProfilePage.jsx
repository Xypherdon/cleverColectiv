import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';
class ProfilePage extends Component {
    constructor(props) {
        super(props);
        let user = { name: 'sd' };
        this.state = {
            language: this.props.language,
            user: user,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.users) {
                this.setState({
                    user: this.props.users.find(
                        user => user._id._str === this.props.userId
                    ),
                });
            }
        }
    }

    render() {
        return (
            <div>
                <span className="user-details-span">
                    <h6>{languages[this.state.language].profilePage.name}</h6>
                    <h2>{this.state.user.name}</h2>
                    <h4>{languages[this.state.language].profilePage.role}</h4>
                    <h2>{this.state.user.role}</h2>
                    <h4>
                        {
                            languages[this.state.language].profilePage
                                .consultingLevel
                        }
                    </h4>
                    <h2>{this.state.user.consultingLevel}</h2>
                    <h4>{languages[this.state.language].profilePage.region}</h4>
                    <h2>{this.state.user.region}</h2>
                    <h4>{languages[this.state.language].profilePage.skills}</h4>
                    <h2>{this.state.user.skills}</h2>
                </span>
                <span className="user-timeline-span">TIMELINE</span>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');

    return {
        users: Users.find().fetch(),
    };
})(ProfilePage);
