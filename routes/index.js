

let express = require('express');
let router = express.Router();

let indexHandler = (req, res, next) =>{

    let model = {
        'username': "overman",
        'channels': [{'channelName': 'channelName', 'users': ['user01', 'user02'], 'mute': false}],
        'members': [{usename: 'username'}]
    };

    res.render('index', model);

};
router.get('/',indexHandler);

module.exports = router;