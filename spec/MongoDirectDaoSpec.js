
let async = require('async');
let expect = require('expect');

const uuid = require('../src/shared/utils/uuid');
const config = require('../src/server/config');
let mongoDao = require("../src/server/mongo/MongoDirectDao");

let log = function (msg) {
    console.log(msg);
}

describe("mongodb direct functions", function () {

    let adminDatabase = undefined;
    let testDatabase = undefined;

    let d = new Date().getTime();
    let testDatabaseName = "Test_" + d;

    let d2 = new Date().getTime();
    let testCollectionName = "Test_" + d2;

    let docs = [];



    beforeEach(function (done) {

        for (let i = 0; i < 1000; i++) {
            let aDoc = {"a": i, "b": 2 * i, "c": {"aa": i, "bb": 3 * i}};
            docs.push(aDoc);
        }
        if (testDatabase === undefined) {
            mongoDao.init(function (err, db) {
                adminDatabase = db;
                testDatabase = mongoDao.createDB(testDatabaseName);
                mongoDao.insertMany(testDatabaseName, testCollectionName, docs, function (err, res) {
                    expect(err).toBe(null, ["we have none null error msg"]);
                    done();
                });

            });
        } else {
            done();
        }
    });


    it("it creates a database", function (done) {
        done();
    });

    it("it lists all databases", function (done) {
        mongoDao.getAllDatabases(function (err, items) {
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(items).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            log(items);
            done();
        });
    });

    it("it lists all databases that meat the filter criterion containing 'Test' ", function (done) {
        mongoDao.getDatabases(
            // filter by
            function (obj) {
                return obj.name.includes('Test');
            },
            // completion handler
            function (err, items) {
                log(items);
                expect(err).toBe(null, ["we have none null error msg"]);
                expect(items).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
                done();
            });
    });

    it("it lists all collections in the databases ", function (done) {
        mongoDao.getAllCollections(testDatabaseName, function (err, cols) {
            log(cols);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(cols).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            done();
        });
    });

    it("find all document in database.collection", function find(done) {
        let match = {};
        let options = {};
        mongoDao.find(testDatabaseName, testCollectionName, match, options, function (err, docs) {
            log(docs);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(docs).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            done();
        });
    });

    it("find all document in database.collection thst matches criterion", function (done) {
        let match = {'a': 10};
        let options = {};
        mongoDao.find(testDatabaseName, testCollectionName, match, options, function (err, docs) {
            log(docs);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(docs).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            done();
        });
    });

    it("find with options", function findWithOptions(done) {
        let match = {};
        let options = {};
        options.skip = 10;
        options.limit = 100;

        mongoDao.find(testDatabaseName, testCollectionName, match, options, function (err, docs) {
            log(docs);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(docs).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            done();
        });
    });


    it("find with match", function findWithMatch(next) {
        let match = {'a': 2};
        let options = {};
        mongoDao.find(testDatabaseName, testCollectionName, match, options, function (err, docs) {
            log(docs);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(docs).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            next();
        });
    });

    it("find with options",function findWithOptions(next) {
        let match = {};
        let options = {};
        options.skip = 10;
        options.limit = 10;

        mongoDao.find(testDatabaseName, testCollectionName, match, options, function (err, docs) {
            log(docs);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(docs).toNotBe(undefined, ["ReactWrappedDatabasesTable Returned undefined"]);
            next();
        });
    });


    it("it insert doc to collection in database",function insert(next) {
        console.log("insertOne   --------------------------");
        mongoDao.insertOne(testDatabaseName, testCollectionName, {"x": "x", "y": "y"}, function (err, res) {
            log(res);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(res).toNotBe(undefined, ["undefined"]);
            next();
        });
    });


    it("insert many",function insertMany(next) {
        mongoDao.insertMany(testDatabaseName, 'c003', [{"x": "x1", "y": "y1"}, {"x": "x2", "y": "y2"}], function (err, res) {
            log(res);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(res).toNotBe(undefined, ["undefined"]);
            next();
        });
    });

    it("insert many new coll",function insertManyNewCollection(next) {
        mongoDao.insertMany(testDatabaseName, 'c004', [{"x": "x1", "y": "y1"}, {"x": "x2", "y": "y2"}], function (err, res) {
            log(res);
            expect(err).toBe(null, ["we have none null error msg"]);
            expect(res).toNotBe(undefined, ["undefined"]);
            next();
        });
    });

    it("it drops collection",function dropCollection(next) {
        console.log("drop    --------------------------");
        mongoDao.dropCollection(testDatabaseName, 'c004', function (err, res) {
            log(res);
            console.log("----------------------------------\n");
            next();
        });
    });

    it("update one",function update(next) {
        console.log("updateOne  ----------------------------");
        let match = {'x': 'x1'};
        let kvMap = {'y': 'CHANGED'};
        mongoDao.updateOne(testDatabaseName, 'c003', match, kvMap, function (err, res) {
            log(res);
            console.log("----------------------------------\n");
            next();
        });
    });


    it("update many",function updateMany(next) {
        mongoDao.collectionExists(testDatabaseName, 'c003', function (err, exists) {
            log(exists);
            console.log("----------------------------------\n");
            next();
        });
    });

    it(" collection dne", function collectionExists(next) {
        mongoDao.collectionExists(testDatabaseName, 'DNE', function (err, exists) {
            log(exists);
            console.log("----------------------------------\n");
            next();
        });
    });
    it(" delete one", function deleteOne(next) {
        mongoDao.deleteDocument(testDatabaseName, testCollectionName, { "a": 1 }, function (err, res) {
            expect(err).toBe(null, ["delete worked"]);
            next();
        });
    });

    it("it insert doc to collection in database many times 100 series",function insert(done) {
        this.timeout(150000);

        function one(next) {
            console.log("insertOne   --------------------------");
            mongoDao.insertOne(testDatabaseName, testCollectionName, {"x": "x", "y": "y"}, function (err, res) {
                log(res);
                expect(err).toBe(null, ["we have none null error msg"]);
                expect(res).toNotBe(undefined, ["undefined"]);
                next(err,res);
            });
        }

        let chain = [];

        for ( let i =0; i < 100 ; i++){
            chain.push(one);
        }

        async.series(chain,function(err,res){
            expect(err).toNotExist();
            done();
        });
    });

    it("it insert doc to collection in database many times 100 parallel",function insert(done) {
        this.timeout(150000);

        function one(next) {
            console.log("insertOne   --------------------------");
            mongoDao.insertOne(testDatabaseName, testCollectionName, {"x": "x", "y": "y"}, function (err, res) {
                log(res);
                expect(err).toBe(null, ["we have none null error msg"]);
                expect(res).toNotBe(undefined, ["undefined"]);
                next(err,res);
            });
        }

        let chain = [];

        for ( let i =0; i < 100 ; i++){
            chain.push(one);
        }

        async.parallel(chain,function(err,res){
            expect(err).toNotExist();
            done();
        });
    });

});