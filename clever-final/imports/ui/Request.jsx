import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Users } from '../api/users.js';
import { withTracker } from 'meteor/react-meteor-data';
import languages from '../lang/languages.json';

export default class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: this.props.request,
            requestAuthor: this.props.requestAuthor,
            language: this.props.language,
            preview: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                language: this.props.language,
            });
        }
    }

    handleAccept() {
        Meteor.call('requests.accept', this.state.request._id);
        let finalRequestData = this.state.request.requestData;
        const profilePicture = finalRequestData.profilePicture;
        delete finalRequestData.profilePicture;
        if (
            !(
                Object.entries(finalRequestData).length === 0 &&
                finalRequestData.constructor === Object
            )
        ) {
            Meteor.call(
                'users.update',
                this.state.requestAuthor._id,
                finalRequestData
            );
        }
        Meteor.call('pictures.upsert', profilePicture);
    }

    handleRefuse() {
        Meteor.call('requests.refuse', this.state.request._id);
    }

    handlePreview() {
        this.setState({
            preview: !this.state.preview,
        });
    }

    renderPreview() {
        return Object.entries(this.state.request.requestData).map(
            ([key, value], uniqueKey) => {
                if (key === 'profilePicture') {
                    {
                        return (
                            <div key={uniqueKey}>
                                {
                                    languages[this.state.language]
                                        .profilePictureChanged
                                }
                            </div>
                        );
                    }
                } else {
                }
                return (
                    <React.Fragment key={uniqueKey}>
                        {languages[this.state.language][key]}:{' '}
                        {languages[this.state.language].old}:{' '}
                        {this.state.requestAuthor[key]}{' '}
                        {languages[this.state.language].new}: {value}
                    </React.Fragment>
                );
            }
        );
    }

    render() {
        let preview = '';

        if (this.state.preview) {
            preview = this.renderPreview();
        }

        return (
            <React.Fragment>
                <td>
                    {this.state.requestAuthor.firstName}{' '}
                    {this.state.requestAuthor.lastName}
                </td>

                <td>
                    <button
                        className="form-input-submit"
                        onClick={this.handleAccept.bind(this)}
                    >
                        {languages[this.state.language].accept}
                    </button>
                </td>
                <td>
                    <button
                        className="form-input-submit"
                        onClick={this.handleRefuse.bind(this)}
                    >
                        {languages[this.state.language].refuse}
                    </button>
                </td>
                <td>
                    <button
                        className="form-input-submit"
                        onClick={this.handlePreview.bind(this)}
                    >
                        {languages[this.state.language].preview}
                    </button>
                </td>
                <td>{preview}</td>
            </React.Fragment>
        );
    }
}
