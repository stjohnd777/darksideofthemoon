
let MongoClient = require('mongodb').MongoClient;
let MongoServer = require('mongodb').Server;
let config = require('../config');


let log = function (msg) {
    console.log(msg);
};

let names = [];

let databases = [];


module.exports = {

    'ready': false,

    'adminDb': undefined,

    'mongoClient': undefined,

    /**
     * Create Connection to admin database for mongodb using
     * coordinates in the config.js file.
     *
     * The connection is cached
     *
     *      mapNameToDb['admin'] = db.
     *
     * When the connection has been established the callback is invoked
     * with the standard Node style callback(err,res)
     *
     * @param callback
     */
    init: function (callback) {

        this.mongoClient = new MongoClient(new MongoServer(config.mongo.host, config.mongo.port));
        let that = this;
        let adminUrl = config.mongo.getAdminUrl();

        this.mongoClient.connect(adminUrl, {}, function (err, adminDB) {
            that.adminDb = adminDB;
            that.ready = true;
            //that.mapNameToDb['admin'] = adminDB;
            if (callback) {
                callback(err, adminDB);
            }
        });
    },


    /**
     * List all databases on this mongodb instance Server
     *
     * @param callback
     */
    getAllDatabases: function (callback) {

        this.adminDb.admin().listDatabases(function (err, dbs) {
            let ldbs = dbs.databases;
            callback(err, ldbs);
        });

    },


    /**
     * Create a new database on this mongodb instance
     *
     * @param name
     * @returns {Db|*}
     */
    "createDB": function (name) {

        let secondDb = this.adminDb.db(name);
        return secondDb;
    },


    /**
     * Drop the named database on this mongodb instance
     *
     * @param databaseName
     */
    "drop": function (databaseName) {

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            db.dropDatabase(function () {

            });
        });
    },

    /**
     * Get a connection for the named database databaseName and call
     * the supplied callback with the connection or error when completed
     *
     * @param databaseName
     * @param callback
     */
    "getConnectionForDatabase": function (databaseName, callback) {
        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            callback(err, db);
        });
    },

    /**
     * List all databases on the server that pass the filter criterion. filter
     * is a function that return boolean, boolean fileter( target), target passes the filter
     * the return value is true.
     * @param filter
     * @param callback
     */
    getDatabases: function (filter, callback) {
        this.adminDb.admin().listDatabases(function (err, db) {
            let dbs = db.databases;
            let ret;
            if (filter) {
                ret = dbs.filter(filter);
            } else {
                ret = dbs;
            }
            callback(err, ret);
        });

    },

    /**
     * Does the collection exist on the named database
     *
     * @param databaseName
     * @param collectionNamebut
     * @param callback
     */
    collectionExists: function (databaseName, collectionName, callback) {

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                callback(err, null);
                return;
            }
            db.listCollections({name: collectionName}).next(function (err, collinfo) {
                let ret = false;
                if (collinfo) {
                    ret = true;
                }
                callback(err, ret);
            });
        });
    },

    /**
     * Make connection for named database, caceh the result for future
     * usage against the name, and invoke the completion handler with
     * callback(err,db)
     *
     * @param name
     * @param callback
     */
    getConnectionForNamedDatabase: function (name, callback) {

        // not working, revist latter
        let db;
        let index = names.indexOf(name);
        if (index != -1) {
            db = databases[index];
        }
        //let that = this;
        //db = this.mapNameToDb[name];

        if (db) {
            if (callback) {
                callback(null, db);
            }
        } else {
            let url = config.mongo.getDatabaseUrlNoAuth(name);
            let mongoClient = new MongoClient(new MongoServer(config.mongo.host, config.mongo.port));

            mongoClient.connect(url, {user: config.mongo.user, pwd: config.mongo.pass}, function (err, db) {

                if (err) {
                    console.log(err);
                    callback(err, null);
                    return;
                }
                names.push(name);
                databases.push(db);
                //that.mapNameToDb[name] = db;
                db.admin().authenticate(config.mongo.user, config.mongo.pass, function (err, res) {
                    if (err) {
                        callback(db, null);
                    } else {
                        callback(null, db);
                    }
                });

            });
        }
    },

    /**
     * List all collections on the named database, then invoke the
     * completion handler callback(err,res)
     *
     * @param databaseName
     * @param callback
     */
    getAllCollections: function (databaseName, callback) {

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                callback(err, null);
                return;
            }
            //db.authenticate(config.mongo.user,config.mongo.pass);
            db.listCollections().toArray(function (err, items) {
                callback(err, items);
                return;
            });
        });

    },

    /**
     * List all collections on the named database that pass the filter function
     * then invoke the completion handler callback(err,res)
     *
     * @param databaseName
     * @param filter
     * @param callback
     */
    getCollections: function (databaseName, filter, callback) {

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            db.getAllCollections().toArray(function (err, items) {
                callback(err, items);
            });
        });

    },


    /**
     * Find document in named database collection with match criterion and options,
     * call completion handler when done.
     *
     * @param databaseName
     * @param collectionName
     * @param match
     * @param options
     * @param callback
     */
    find: function find(databaseName, collectionName, match, options, callback) { // TODO : option contain sorting filter

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                callback(err, null);
                return;
            } else {
                match = match || {};
                options = options || {};
                let skip = options.skip || 0;
                let limit = options.limit || 999999;
                let sorton = options.sort || false;
                let asc = options.ascending || -1;

                let cursor = db.collection(collectionName).find(match).sort({'id': -1}).skip(parseInt(skip)).limit(parseInt(limit));


                // if (sorton) {
                //     cursor = db.collection(collectionName).find(match).sort({sorton: asc}).skip(parseInt(skip)).limit(parseInt(limit));
                // } else {
                //     cursor = db.collection(collectionName).find(match).skip(parseInt(skip)).limit(parseInt(limit));
                // }

                let docs = cursor.toArray(function (err, docs) {
                    if (callback) {
                        callback(err, docs);
                    }

                });
            }
        });

    },

    /**
     * Insert Document into named collection on named database database and call
     * completion handler with results
     *
     * @param databaseName
     * @param collectionName
     * @param doc
     * @param callback
     */
    insertOne: function (databaseName, collectionName, doc, callback) {
        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                callback(err, null);
                return;
            }
            db.admin().authenticate(config.mongo.user,config.mongo.pass,function(err,res){
               if ( !err) {
                   db.collection(collectionName).insertOne(doc, callback);
               }
            });
            //db.collection(collectionName).insertOne(doc, callback);
        });
    },

    /**
     * Insert Document into named collection on named database database and call
     * completion handler with results
     *
     * @param databaseName
     * @param collectionName
     * @param doc
     * @param callback
     */
    insertMany: function (databaseName, collectionName, docs, callback) {
        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                log(err);
                callback(err, null);
                return;
            }
            db.collection(collectionName).insert(docs, callback);
        });
    },

    /**
     * Update on document in the named database, on named collection, that
     * meets the matchg criterion, and update fileds with the kvMap, and call
     * completion handler when done
     *
     * @param databaseName
     * @param collectionName
     * @param match
     * @param kvMap
     * @param callback
     */
    updateOne: function (databaseName, collectionName, match, kvMap, callback) {
        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                log(err);
                callback(err, null);
                return;
            }
            db.collection(collectionName).updateOne(match, {$set: kvMap}, function (err, results) {
                callback(err, results);
            });
        });
    },

    updateMany: function (databaseName, collectionName, match, kvMap, callback) {
        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                log(err);
                callback(err, null);
                return;
            }
            db.collection(collectionName).update(match, {$set: kvMap}, function (err, results) {
                callback(err, results);
            });
        });
    },

    /**
     * Delete named collection collection on named database and call completion
     * handler with the results
     *
     * @param databaseName
     * @param collectionName
     */
    dropCollection: function (databaseName, collectionName, callback) {

        this.getConnectionForNamedDatabase(databaseName, function (err, db) {
            if (err) {
                log(err);
                callback(err, null);
                return;
            }
            db.dropCollection(collectionName, function (err, result) {
                callback(err, result);
            });
        });
    },

    /**
     * Delete a single document from a collection
     *
     * @param databaseName
     * @param collection
     * @param doc
     */
    deleteDocument: function (databaseName, collectionName, kvMap, callback) {
        this.getConnectionForDatabase(databaseName, function (err, db) {
            if (err) {
                log(err);
                callback(err, null);
                return;
            }
            db.collection(collectionName).removeOne(kvMap, callback);
        });
    }
};


let MongoDao = {

    "adminDb": module.exports.adminDb,

    "init": function (callback) {
        module.exports.init(callback);
    },
    "init2": function (url, callback) {
        module.exports.init(callback);
    },

    "Database": {

        "createDatabase": function (name) {
            return module.exports.createDB(name);
        },

        "getAllDatabases": function (callback) {
            module.exports.getAllDatabases(callback);
        },
        "getDatabases": function (filter, callback) {
            module.exports.getDatabases(filter, callback);
        },

        "drop": function (databaseName) {
            this.getConnectionForDatabase(databaseName, function (err, db) {
                db.dropDatabase(function (err, res) {
                    console.log(err);
                    console.log(res);
                    console.log("dropped");
                })
            });
        },

        "getConnectionForDatabase": function (databaseName, callback) {
            module.exports.getConnectionForNamedDatabase(databaseName, function (err, db) {
                callback(err, db);
            });
        }


    },

    "Collection": {

        "getAllCollections": function (databaseName, callback) {
            module.exports.getAllCollections(databaseName, callback);
        },

        "getCollections": function (databaseName, filter, callback) {
            module.exports.getCollection(databaseName, filter, callback);
        },
        "dropCollection": function (databaseName, collectionName, callback) {
            module.exports.dropCollection(databaseName, collectionName, callback);
        }
    },

    "Crud": {

        /**
         *
         * @param databaseName
         * @param collectionName
         * @param match
         * @param options
         * @param callback
         */
        "find": function (databaseName, collectionName, match, options, callback) {
            module.exports.find(databaseName, collectionName, match, options, callback);
        },

        /**
         *
         */
        "insert": {

            "one": function (databaseName, collectionName, doc, callback) {
                module.exports.insertOne(databaseName, collectionName, doc, callback);
            },
            "many": function (databaseName, collectionName, docs, callback) {
                module.exports.insertMany(databaseName, collectionName, docs, callback);
            }
        },

        /**
         *
         */
        "update": {

            "one": function (databaseName, collectionName, match, kvMap, callback) {
                module.exports.updateOne(databaseName, collectionName, match, kvMap, callback);
            },
            "many": function (databaseName, collectionName, match, kvMap, callback) {
                module.exports.updateMany(databaseName, collectionName, match, kvMap, callback);
            }
        },

        /**
         *
         * @param databaseName
         * @param collectionName
         * @param match
         * @param callback
         */
        "delete": function (databaseName, collectionName, match, callback) {
            // intentionally deficient
            //module.exports.deleteDocument(databaseName, collectionName, match, callback);
        }
    }

};

module.exports.dao = MongoDao;


MongoDao.init( (err,ret)=>{
    "use strict";

    MongoDao.Collection.getAllCollections('Daniel',(err,res)=>{
        console.log(res);
    });

    // MongoDao.Database.getAllDatabases( (err,res) =>{
    //     "use strict";
    //     console.log(res);
    // });
    //
    // MongoDao.Database.createDatabase("Daniel");
    //
    // MongoDao.Crud.insert.one("Daniel", "Romm001",{a:0,b:2},(err,res)=>{
    //     console.log(res);
    // });

});



// MongoDao.Database.getAllDatabases( (err,res) =>{
//     "use strict";
//     console.log(res);
// });

// MongoDao.Crud.find('rpmdm_system', 'logs', { "uri" : "http://localhost:12345/mdm/db/database/query" }, {}, function (err, res) {
//     if (err)
//         console.log(err);
//     else
//         console.log("**********************************************************");
//         console.log("success");
//         console.log("length :" + res.length);
//         for( let record of res){
//             console.log("**********************************************************");
//             console.log(record);
//         }
//
// });
