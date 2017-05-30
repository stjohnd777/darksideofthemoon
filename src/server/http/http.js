let request = require('request');

/**
 *
 * @type {{get: ((p1?:*, p2?:*)), post: ((p1?:*, p2?:*, p3?:*)), put: ((p1?:*, p2?:*, p3?:*)), del: ((p1?:*, p2?:*))}}
 */
export const http = {

    /**
     *
     * @param uri
     * @param callback
     */
    get: (uri, callback) => {
        "use strict";
        request.get(
            uri,
            (error, response, body) => {
                if (callback) callback(error, body)
            }
        );
    }
    ,
    /**
     *
     * @param uri
     * @param post_data
     * @param callback
     */
    post: (uri, post_data, callback) => {
        "use strict";
        request.post(
            uri,
            {json: post_data},
            (error, response, body) => {
                "use strict";
                body = body || {};
                body.uri = uri;
                body.post_data = post_data;
                body.response_error = "" + error;
                body.dt_in = (new Date()).toString();
                if (callback) callback(error, body);
            }
        );
    }
    ,
    /**
     *
     * @param uri
     * @param post_data
     * @param callback
     */
    put: (uri, post_data, callback) => {
        "use strict";
        request.put(
            uri,
            {json: post_data},
            (error, response, body) => {
                if (response.statusCode != 200 && !error) error = response.statusCode;
                if (callback) callback(error, body);
            });
    }
    ,
    /**
     *
     * @param uri
     * @param callback
     */
    del :(uri,callback) => {
        "use strict";
        request.del(
            uri,
            (error, response, body) => {
                if (response.statusCode != 200 && !error) error = error = response.statusCode;
                if (callback) callback(error, body);
            });
    }
};