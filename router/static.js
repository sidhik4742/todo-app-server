const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

const middleware = require("../middleware/token");
const modalData = require("../index");
const { json } = require("body-parser");

router.post("/register", middleware.Validation, (req, res) => {
  let userRegisterDetails = req.body;
  //   console.log(req.body);
  //   console.log(`user register details ${req.body}`);
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
    if (error) {
      throw error;
    }
    console.log("Connected successfully to server");
    const dbName = db.db("customerDetails");
    var query = { emailOrPhone: userRegisterDetails.emailOrPhone };
    dbName
      .collection("registerDetails")
      .find(query)
      .toArray((error, collection) => {
        console.log(collection);
        if (collection.length !== 0) {
          res.send("email or phone already registered");
          console.log("email or phone already registered");
          db.close();
        } else {
          dbName
            .collection("registerDetails")
            .insertOne(userRegisterDetails, (error, collection) => {
              if (error) {
                console.error(error);
                res.send("registration failed please try again" + error);
              } else {
                console.log(collection.result);
                res.send("successfully registered");
              }
              db.close();
            });
        }
      });
  });
});
router.post("/login", middleware.Token, (req, res) => {
  console.log("login form data");
  console.log(req.body);

  res.json(modalData.data);
});

router.get("/display", (req, res) => {
  res.json(modalData.data);
  console.log(modalData.data);
});

router.post("*", (req, res) => {
  res.send("No root available");
});

router.get("*", (req, res) => {
  res.send("No root available");
});

module.exports = router;
