
module.exports  = {

    socketIO : require('socket.io')
    ,
    io : undefined
    ,
    SetUpSocketIO : function (app)   {

        this.io = this.socketIO.listen(app);

        this.io.on('connection', function (socket) {
            console.log('a user connected');
            let eventCon = {
                type : 'connection',
                message : 'Hi'
            };
            socket.broadcast.emit(eventCon);
        });

        let channel0 = 'channel0';
        var myVar0 = setInterval(()=>{
            "use strict";
            this.SendMessage(channel0, Date.now());
        }, 30000);


    },

    CreateChannel : (name) =>{
        "use strict";

    },

    SendMessage : function(channel,message, callback){
        "use strict";
         this.io.sockets.emit(channel, message);
         if (callback){
             callback();
         }
    }
};




