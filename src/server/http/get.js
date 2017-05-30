let request = require('request');

export const get = (uri,callback) =>{

    request.get(
        uri,
        (error, response, body) =>{
        if(callback) callback(error, body);
    });
    
};

let App = window.App || {};
App.Http = {};
App.Http.get = get;

