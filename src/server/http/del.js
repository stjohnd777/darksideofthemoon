let request = require('request');


export const del = (uri,callback) =>{

    request.del(
        uri,
        (error, response, body) => {
        if (response.statusCode != 200 && !error) error = error = response.statusCode;
        if(callback) callback(error, body);
    });
};

let App = window.App || {};
App.Http = {};
App.Http.del = del;