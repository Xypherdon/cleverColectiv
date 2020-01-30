/**
 * @prettier
 */

import '../imports/api/users.js';
import '../imports/api/requests.js';
import '../imports/api/projects.js';
import '../imports/api/pictures.js';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';

Meteor.startup(() => {
    render(<App />, document.getElementById('react-target'));
});
