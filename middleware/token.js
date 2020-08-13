// const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// const MongoClient = require("../module");
// const static = require("../router/static");
const jwtPrivateKey = "shopItemsManagement";

// Mngo DB Connection URL
// const url = "mongodb://localhost:27017";

function authentication(req, res, next) {
  console.log("token validation");
  // console.log(req.headers.authorization);
  let authorization = req.headers.authorization;
  // let jwtPrivateKey = static.jwtPrivateKey;
  jwt.verify(authorization, jwtPrivateKey, function (error, decoded) {
    if (error) {
      res.status(401).send("user not authorized");
      return true;
    } else {
      // console.log(decoded);
      res.locals.Username = decoded.Username;
      res.locals.Password = decoded.Password;
      next();
    }
  });
}

function validation(req, res, next) {
  console.log("validation middleware");
  next();
}

module.exports = { authentication, validation };
