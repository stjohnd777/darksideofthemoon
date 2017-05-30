const cookieParser = require('cookie-parser');
const session      = require('express-session');
const utils        = require('../utils/utils');
const Uuid         = require('../utils/uuid');


/**
 *  REST service endpoint,
 *
 * @param method the HTTP method
 * @param path the path for example /foo
 * @param provider the function handling the request response
 * @constructor
 */
function RestEndpoint(method, path, provider,secure,key_file,crt_file){
    this.method     = method;
    this.path       = path;
    this.provider   = provider;
    this.secure = secure || false;
    this.key_file =key_file;
    this.crt_file = crt_file;
}
/**
 * Export RestEndpoint
 *
 * @type {RestEndpoint}
 */
module.exports.RestEndpoint = RestEndpoint;


/**
 * Creates stand-alone server with middleware on the endpoints
 *
 * @param name
 * @param endpoints
 * @constructor
 */
function RestServiceFactory(name, endpoints){

    var service = name;


    RestServiceFactory.prototype.exec = function exec (req,res,provider){
        provider(req,res);
    };

    var express = require('express');
    var app = express();

    var https = undefined;
    var fs = undefined;
    var httpsOptions = undefined;

    if(secure) {

        fs = require('fs');
        https = require('https');

        httpsOptions = {
            key: fs.readFileSync( key_file)
            ,cert: fs.readFileSync( config.https.crt_file)
        };
    }
    // Set up the session
    app.use(cookieParser());

    app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: false}));
    // middleware for post data

    app.use(function (req, res, next) {
        var data = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            data += chunk;
        });

        req.on('end', function () {
            req.body = data;
            next();
        });
    });


    // some generic middleware catch, for example use this for authentication
    // or permissions
    app.use(function( req,res,next){
        next();
    });

    app.get('/ping', function(req,res){
        let now = new Date();
        res.json( {
            success: true,
            payload: {
                service: name,
                message: "Service is running",
                server_time: now.toUTCString()
            }})});


    for ( let index in endpoints) {

        let method   = String(endpoints[index].method);
        let path     = endpoints[index].path;
        let provider = endpoints[index].provider;
        let secure   = endpoints[index].secure;
        let key_file = endpoints[index].key_file;
        let crt_file = endpoints[index].crt_file;
        
        switch(method.toUpperCase()) {
            case "GET":
                app.get(path, provider);
                break;
            case "POST":
                app.post(path, provider);
                break;
            case "PUT":
                app.put(path, provider);
                break;
            case "DEL":
            case "DELETE":
                app.delete(path, provider);
                break;
            default:
                throw new Error("RestServiceFactory: invalid ajax method " + method);
        }
    }

    if( secure) {

        this.start = function(port,callback) {
            var server = https.createServer(httpsOptions, app);
            server.listen( port, function() {
                console.log(server + " service is running securely on " + port);
                if(callback) {
                    callback();
                }
            });
        };

    } else {
        this.start = function (port,callback) {

            app.listen(port, function (err, res) {
                console.log(service + " service is running on " + port);
                if(callback) {
                    callback(err, res);
                }
            });
        };
    }

    this.stop = function(){
        console.log(service + " service is down on "
        );
        app.close();
    }

}
module.exports.RestServiceFactory = RestServiceFactory;

/**
 * The envelope about all Rest services
 *
 * @param errorMessage  
 * @param errorCode
 * @param originalMessage
 * @param stackTrace
 * @constructor
 */
function Error(errorMessage, errorCode, originalMessage, stackTrace){
    this.messages =  utils.asArray( errorMessage );
    this.error_code = errorCode;
    this.original_message = originalMessage;
    this.stack_trace = stackTrace;
}
module.exports.Error = Error;






