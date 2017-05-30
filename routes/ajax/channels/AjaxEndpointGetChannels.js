let endpoint = '/ajax/channels/:user';

module.exports = (server, Api) => {

    server.get(endpoint, (req, res) => {

            let user = req.params.user;

            Api.GetRooms(user, function (err, results) {
                res.json(results);
            });
        }
    );

};