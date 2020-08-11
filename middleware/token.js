const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Mngo DB Connection URL
const url = "mongodb://localhost:27017";

function authentication(req, res, next) {
  console.log("creating token");
  let userName = req.body.userName;
  let password = req.body.password;
   
  console.log("user logged");
  // next();
  // return true;
}

function validation(req, res, next) {
  console.log("validation middleware");
  next();
}

module.exports = { authentication, validation };
