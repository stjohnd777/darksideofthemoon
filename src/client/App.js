require('../client/css/darksidemoon.scss');
require('socket.io-client');

const $ = require('jquery');


let React = require('react');
let ReactDom = require('react-dom');
import {Message} from './jsx/message'


require('./../shared/utils/uuid');


let App = window.App || {};

App.Cipher = require('./../shared/cipher');
App.Rand   = require('./../shared/utils/uuid');
App.Ajax   = require('./ajax/Ajax.js');

App.renderMessage = (title,msg,id) => {
    ReactDom.render(<Message title={title} message={msg}/>, document.getElementById(id));
};

window.App = App;