const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const connect2Mongo = (callback) => {
  MongoClient.connect(
    'mongodb+srv://dreiptrmongo:GQZPFEqpe3t0uY7L@nodecourse.0jtkdd5.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'
  )
    .then((client) => {
      console.log('Connected!');

      const databaseName = 'shop';
      _db = client.db(databaseName);
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.connect2Mongo = connect2Mongo;
exports.getDb = getDb;
