
const GET = require("../shared/utils/get").get;

const REST = require('./RestServiceFactory'),
      Response = REST.Response,
      RestEndpoint = REST.RestEndpoint,
      RestServiceFactory = REST.RestServiceFactory;

const UUID  = require("../sharded/utils/uuid");


/**
 * Service Generates Unique Id
 *
 * @type {*|RestServiceFactory}
 */
export const service = new RestServiceFactory(
    "UUID",
    [
        new RestEndpoint(
            'GET',           // method
            '/uuid',         // uri
            (req, res) => {  // provider
                let ret;
                try {
                    let uuid = UUID.generateUUID();
                    ret = new Response(true,uuid);
                } catch(e) {
                    ret = JSON.stringify(e);
                }
                res.json(ret);
        })
    ]
);


export const start = (port) => {
    console.log("UUID service started on " + port);
     service.start(port);
};

