require('./css/darksidemoon.scss');
require('socket.io-client');

const $ = require('jquery');
$('#target').html('hello world jquery');

let React = require('react');
let ReactDom = require('react-dom');
import {Message} from './jsx/message'

// require('./../shared/http/get');
// require('./../shared/http/put');
// require('./../shared/http/post');
// require('./../shared/http/del');
// require('./../shared/http/uuid');
require('./../shared/utils/uuid');
require('./../shared/cipher');

let App = window.App || {};
App.renderMessage = (title,msg,id) => {
    ReactDom.render(<Message title={title} message={msg}/>, document.getElementById(id));
};
window.App = App;