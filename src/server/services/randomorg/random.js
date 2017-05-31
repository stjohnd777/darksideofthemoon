/**
 * Created by dstjohn on 2/8/2016.
 *
 * REST example to random.org
 *
 */
var request = require('request');


module.exports.key =  "24378549-9515-4c12-9bce-1c8da6ac2201";
/**
 * Generate a Set of truly Random Integers from a REST call
 * to random.or which uses the atmospheric noise
 *
 * @param numberSamples
 * @param floor
 * @param ceiling
 * @param callback
 * @constructor
 */
function GetRandomIntegers(numberSamples, floor, ceiling, key, callback) {

    key =  key || module.exports.key;
    this.request_id = this.request_id || 1 ;
    this.request_id++;

    var post_data = {
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
        "apiKey": "00000000-0000-0000-0000-000000000000",
            "n": numberSamples,
            "min": floor,
            "max": ceiling,
            "replacement": true,
            "base": 10
    },
        "id": 19639
    };


    request.post('https://api.random.org/json-rpc/1/invoke', {json: post_data}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var ret = body.result.random.data;
            //console.log(ret);
            if (callback) {
                callback(ret);
            }
        } else {
            console.log(error);
        }
    });


    //var url_path = 'https://www.random.org/integers/?num=10&min=0&max=100&col=1&base=10&format=plain&rnd=new';
    //var url_path2 = 'https://www.random.org/integers/?num='+ numberSamples +'&min=' + floor + '&max=' +ceiling +'&col=1&base=10&format=plain&rnd=new';
    //request(url_path, function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //        console.log(body);
    //        if (callback) {
    //            callback(body);
    //        }
    //    }
    //});
}
/**
 * Export : Generate a Set of truly Random Integers from a REST call
 * to random.or which uses the atmospheric noise
 *
 * @param numberSamples
 * @param floor
 * @param ceiling
 * @param callback
 * @constructor
 */
module.exports.randInt = GetRandomIntegers;
module.exports.GetRandomIntegers = GetRandomIntegers;

/**
 * Generate a Set of truly Random DecimalNumbers with precision from a REST call
 * to random.or which uses the atmospheric noise
 *
 * @param numberSamples
 * @param precision
 * @param key
 * @param callback
 * @constructor
 */
function GetRandomDecimal(numberSamples, precision, key, callback) {

    key =  key || module.exports.key;
    this.request_id = this.request_id || 1 ;
    this.request_id++;

    var post_data =
    {
        "jsonrpc": "2.0",
        "method": "generateDecimalFractions",
        "params": {
            "apiKey": key,
            "n": numberSamples,
            "decimalPlaces": precision,
            "replacement": "true"
        },
        "id": "2121"
    };

    request.post('https://api.random.org/json-rpc/1/invoke', {json: post_data}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var ret = body.result.random.data;
            //console.log(ret);
            if (callback) {
                callback(ret);
            }
        } else {
            console.log(error);
        }
    });
}

/**
 * Export: Generate a Set of truly Random DecimalNumbers with precision from a REST call
 * to random.or which uses the atmospheric noise
 *
 * @param numberSamples
 * @param precision
 * @param key
 * @param callback
 * @constructor
 */
module.exports.randDec = GetRandomDecimal;
module.exports.GetRandomDecimal = GetRandomDecimal;


function GetRandomString(numberSamples, length, key, callback) {

    key =  key || module.exports.key;
    this.request_id = this.request_id || 1 ;
    this.request_id++;


    var post_data =
    {
        "jsonrpc": "2.0",
        "method": "generateStrings",
        "params": {
            "apiKey": key,
            "n": numberSamples,
            "length": length,
            "characters": "abcdefghijklmnopqrstuvwxyz",
            "replacement": true
        },
        "id": request_id
    }

    request.post('https://api.random.org/json-rpc/1/invoke', {json: post_data}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            var ret = body.result.random.data;
            //console.log(ret);
            if (callback) {
                callback(ret);
            }
        } else {
            console.log(error);
        }
    });
}

module.exports.GetRandomString = GetRandomString;
