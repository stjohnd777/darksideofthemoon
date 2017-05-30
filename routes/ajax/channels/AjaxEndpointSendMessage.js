let endpoint = '/ajax/send/';

module.exports = (server, Api) => {

    server.post(endpoint, (req, res) => {

            let room = req.body.channel;
            let message = req.body.cipherTxt;

            Api.SendMessage(room, message, function (err, results) {
                res.json(results);
            });
        }
    );

};