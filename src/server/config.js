module.exports = {

    mongo : {
        'host': 'localhost',
        'port': 27017,
        'user': 'admin',
        'pass': 'redpoint',

        /**
         * get the mongo db connection url with authentication
         * @returns {string}
         */
        getAdminUrl: function () {
            let uri = "mongodb://" + this.user + ":" + this.pass + "@" + this.host + ":" + this.port;
            return uri;
        },

        /**
         * Url for named database with authentication
         *
         * @param name
         * @returns {string}
         */
        getUrl: function (name) {
            let uri = "mongodb://" + this.user + ":" + this.pass + "@" + this.host + ":" + this.port + "/" + name;
            return uri;
        },

        /**
         * get the mongo db connection url without authentication
         * @returns {string}
         */
        getDatabaseUrlNoAuth: function (name) {
            let uri = "mongodb://" + this.host + ":" + this.port + "/" + name;
            return uri;
        },

        'admin_db': 'admin',

    }
};