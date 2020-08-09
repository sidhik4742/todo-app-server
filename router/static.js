const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Mngo DB Connection URL
const url = "mongodb://localhost:27017";

const saltRounds = 10;

const middleware = require("../middleware/token");
const modalData = require("../index");
const { json } = require("body-parser");

//////////////////////////////////////////Api for registration////////////////////////////////////
router.post("/register", middleware.validation, (req, res) => {
  //   console.log(req.body);
  
  const encryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  let userName = req.body.userName;
  let emailOrPhone = req.body.emailOrPhone;
  let model = req.body.model;

  //   console.log(encryptedPassword);
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
    if (error) {
      throw error;
    }
    console.log("Connected successfully to server");
    const dbName = db.db("customerDetails");
    var query = { EmailOrPhone: emailOrPhone };
    dbName
      .collection("registerDetails")
      .find(query)
      .toArray((error, collection) => {
        // console.log(collection);
        if (collection.length !== 0) {
          res.send("email or phone already registered");
          console.log("email or phone already registered");
          db.close();
        } else {
          dbName.collection("registerDetails").insertOne(
            {
              Username: userName,
              EmailOrPhone: emailOrPhone,
              Model: model,
              Password: encryptedPassword,
            },
            (error, collection) => {
              if (error) {
                console.error(error);
                res.send("registration failed please try again");
              } else {
                console.log(collection.result);
                res.send("successfully registered");
              }
              db.close();
            }
          );
        }
      });
  });
});

/////////////////////////////*********Api for Login**************////////////////////////////////
router.post("/login", middleware.authentication, (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
    if (error) {
      throw error;
    }
    console.log("Connected successfully to server");
    const dbName = db.db("customerDetails");
    var query = { Username: userName };
    dbName
      .collection("registerDetails")
      .find(query)
      .toArray((error, collection) => {
        console.log(collection);
        if (collection.length === 0) {
          res.send(`User not registered`);
        } else {
          collection.forEach((user, index) => {
            // console.log(bcrypt.compareSync(password, user.Password));
            if (bcrypt.compareSync(password, user.Password)) {
            }
          });
        }
      });
  });
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
