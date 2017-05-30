let asyn = require('asyn');
let bcrypt = require('bcrypt');

let express = require('express');
let router = express.Router();

let loginHandler = (req, res, next) =>{
    let model = {
        'name': "overman",
        'channels': [{'channelName': 'channelName', 'users': ['user01', 'user02'], 'mute': false}],
        'members': [{usename: 'username'}]
    };
    res.render('index', model);

};
router.get('/',loginHandler);

module.exports = router;

