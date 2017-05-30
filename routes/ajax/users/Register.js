let endpoint = '/ajax/user/register/';

export const ajaxEndpointSend = (server, Api) => {

    server.post(endpoint, (req, res) => {

            let room = req.params.room;
            let message = req.body;

            Api.SendMessage(room, message, function (err, results) {
                res.json(results);
            });
        }
    );

};