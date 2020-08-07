const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

const insertDocument = (userRegisterDetails) => {
  // Use connect method to connect to the server
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
    if (error) {
      throw error;
    }

    console.log("Connected successfully to server");

    const dbName = db.db("customerDetails");

    dbName
      .collection("registerDetails")
      .insertOne({}, { $set: userRegisterDetails }, (error, collection) => {
        if (error) {
          console.log(error);
        } else {
          console.log(collection);
        }
      });
    console.log(userRegisterDetails);
  });
};

module.exports = { insertDocument };
