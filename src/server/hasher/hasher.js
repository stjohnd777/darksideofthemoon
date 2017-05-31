let bcrypt = require('bcrypt');

let Hasher = {

    generateHash(myPlaintextPassword,saltRounds = 10){

        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
        });
    },

    comparePassword : (myPlaintextPassword,onFail,onSuccess) =>{

        bcrypt.compare(myPlaintextPassword, hash, (err, res) =>{
            if ( res === true){
                onSuccess(res);
            }else {
                onFail(res);
            }
        });
    }
};

module.exports = Hasher;