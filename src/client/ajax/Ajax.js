import OverlayTimer from '../ui/OverlayTimer';

function StringifyAlert(result) {
    alert(JSON.stringify(result, null, 2));
}


function MessageFromJQXHR(jqXHR) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connected. Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (errorThrown === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (errorThrown === 'timeout') {
        msg = 'Time out error.';
    } else if (errorThrown === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error. ' + jqXHR.responseText;
    }
    return msg;
}



module.exports = {

    doAjaxGet: (theAjaxUrl, callback) => {
        let timer = new OverlayTimer('#waitOverlay');
        timer.startOverlay();
        $.ajax({
            url: theAjaxUrl,
            type: 'GET',
            success: function (result) {
                // turn off timer before or after table refresh? 
                timer.stopOverlay(timer);
                callback(result);
                PrependRequestId(result.request_id, theAjaxUrl);

                if (usesAlert === true) {
                    if (result.success === true) {
                        APP.ShowAlert('success', 'Success', JSON.stringify(result.payload, ' ', 2));
                    } else {
                        APP.ShowAlert('error', 'Applicaion Error', JSON.stringify(result.error, ' ', 2));
                    }
                }
            },
            error: function (jqXHR, status, errorThrown) {
                let msg = MessageFromJQXHR(jqXHR);
                let errResponse = {
                    ajaxErrorHandler: theAjaxUrl,
                    success: false,
                    error: new Error(msg)
                };
                // callbackAlert(errResponse);
                // callback(errResponse);
            }
        });
    },

    /**
     * Put the data 'post_data' to the 'POST' endpoint specified by the url, and is 'callbaclk' function
     * is provide invoke it with the results from endpoint.
     *
     * 1. the data is converted to a string
     * 2. contentType of 'application/json'
     * @param url
     * @param post_data
     * @param callback
     */
    doAjaxPut: (url, post_data, callback) => {
        if (typeof post_data !== 'string' && typeof post_data !== 'undefined') {
            post_data = JSON.stringify(post_data); // assume its an object or at least stringifiable
        }
        $.ajax({
            url: url,
            type: "PUT",
            contentType: "application/json",
            dataType: 'json',
            data: post_data,
            success: function (result) {
                if (callback) {
                    callback(result);
                }
                PrependRequestId(result.request_id, url);
            },
            error: function (jqXHR, status, errorThrown) {
                let msg = MessageFromJQXHR(jqXHR);
                let errResponse = {
                    ajaxErrorHandler: theAjaxUrl,
                    success: false,
                    error: new Error(msg)
                };
                // callbackAlert(errResponse);
                // callback(errResponse);
            }
        });
    },

    /**
     * Two important things going on here.
     * 1. the data is converted to a string before being sent
     * 2. The server expects contentType of 'application/json' for it to interpret the body as JSON
     * @param url
     * @param post_data
     * @param callback
     */
    doAjaxPost: (url, post_data, callback) => {
        if (typeof post_data !== 'string' && typeof post_data !== 'undefined') {
            post_data = JSON.stringify(post_data); // assume its an object
        }
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            data: post_data,
            success: function (result) {

                callback(result, url);

                if (usesAlert === true) {
                    if (result.success === true) {
                        APP.ShowAlert('success', 'Success', JSON.stringify(result.payload, ' ', 2));
                    } else {
                        APP.ShowAlert('error', 'Applicaion Error', JSON.stringify(result.error, ' ', 2));
                    }
                }
                PrependRequestId(result.request_id, url);
            },
            error: function (jqXHR, status, errorThrown) {
                let msg = MessageFromJQXHR(jqXHR);
                let errResponse = {
                    ajaxErrorHandler: url,
                    success: false,
                    error: new Error(msg)
                };
                // callbackAlert(errResponse);
                // callback(errResponse);
            }
        });
    },

    doAjaxDelete: (theAjaxUrl, callback) => {
        let timer = new OverlayTimer('#waitOverlay');
        timer.startOverlay();
        $.ajax({
            url: theAjaxUrl,
            type: 'DELETE',
            success: function (result) {
                // turn off timer before or after table refresh?
                timer.stopOverlay(timer);
                callback(result);
                PrependRequestId(result.request_id, theAjaxUrl);
            }
        });
    }
}
