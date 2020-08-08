const express = require("express");
const router = express.Router();

const middleware = require("../middleware/token");
const modalData = require("../index");
const dbMethods = require("../data/db");

// let middlewareparam = [Token];

router.post("/register", middleware.Validation, (req, res) => {
  //   console.log(req.body);
  //   console.log(`user register details ${req.body}`);
  let flag_id = dbMethods.insertDocument(req.body);
  console.log(flag_id);
  
  if (flag_id) {
    res.send("Register successfully");
  } else {
    res.send("Registration failed try again");
  }
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
