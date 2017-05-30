import  {doAjaxPost} from  './Ajax'


class Channel {

    constructor(creator,name,expirationDate,algo,users){
        this.creator = creator;
        this.name = name;
        this.createDate ;
        this.expiratonDate = expirationDate;
        this.algo = algo;
        this.users = users;
        this.mutted = false;
    }

    addUser(username){

    }

    removeUser(username){

    }
}

class User {

    constructor(username,channels){
        this.username = username;
        this.channels = channels;
    }


}

let FrontSideController = {


    uriCreateUser: '/ajax/user/create',

    uriDeleteUser: '/ajax/user/delete',


    uriCreateChannel: '/ajax/channel/create/',

    uriModifyChannel: '/ajax/channel/modify/',

    uriDeleteChannel: '/ajax/channel/delete/:channel',


    uriSendMessage: '/ajax/send/:channel/',

    uriReceiveMessages: '/ajax/recieve/:channel/',



    createChannel: (channel) => {

    },


    sendMessage: (channel, message, attachements, algo, callback) => {
        "use strict";

        doAjaxPost(uriSendMessage, {
                channel: channel,
                message: message,
                attachements: attachements,
                alg0: algo
            },
            (results) => {
                if (callback) {
                    callback(results);
                }
            })
    },

    recieveMessage: () => {
        "use strict";

    }
    ,

    receiveFormChannel: (channel, messageHandlerCallback) => {
        "use strict";

        doAjaxPost(uriReceiveMessages, {
                channel: channel,
            },
            (results) => {

                if (messageHandlerCallback) {
                    messageHandlerCallback(results);
                }

                socket.on(channel, function (data) {
                    listener(data);
                });
            })
    },


};