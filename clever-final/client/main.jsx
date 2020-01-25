/**
 * @prettier
 */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';

language = 'english';
Meteor.startup(() => {
    render(
        <App language={language} />,
        document.getElementById('react-target')
    );
});
