let request = require('request');

export const post = (uri, post_data, callback) => {

    request.post(uri, {json: post_data}, function (error, response, body) {

        body            = body || {};
        body.uri        = uri;
        body.type       = "Response";
        body.post_data  = post_data;
        body.response_error = "" + error;
        body.dt_in = (new Date()).toString();

        if(callback) callback(error, body);
    });
};

let App = window.App || {};
App.Http = {};
App.Http.post = post;