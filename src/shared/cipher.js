let CryptoJS = require("crypto-js");

let Cipher = {

    encodeAES: (message, secret) => {
        "use strict";
        let ciphertextAES = CryptoJS.AES.encrypt(message, secret);
        return ciphertextAES.toString();
    }
    ,
    decodeAES: (cipherText, secret) => {

        let bytes = CryptoJS.AES.decrypt(cipherText, secret);
        let message = bytes.toString(CryptoJS.enc.Utf8);
        return message;
    }

};

module.exports = Cipher;


