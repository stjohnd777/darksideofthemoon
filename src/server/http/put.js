let request = require('request');

export const put = (uri,post_data,callback) => {

    request.put(
        uri, {json: post_data},
        (error, response, body) => {
            if (response.statusCode != 200 && !error) error = error = response.statusCode;
            if(callback) callback(error, body);
    });
};

let App = window.App || {};
App.Http = {};
App.Http.put = put;