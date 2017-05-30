let mysocketio = require('../../server/socketio');

module.exports = {

    emitMessage : (channel,message) =>{
        "use strict";
        mysocketio.SendMessage(channel,message);

    }
};