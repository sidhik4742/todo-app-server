const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const middleware = require("../middleware/token");
const { json } = require("body-parser");
const { Console } = require("console");

// Mngo DB Connection URL
const url = "mongodb://localhost:27017";

const saltRounds = 10;
const jwtPrivateKey = "shopItemsManagement";

//////////////////////////**********?Api for registration**********/////////////////////////////////
router.post("/register", middleware.validation, (req, res) => {
  const encryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  let userName = req.body.userName;
  let emailOrPhone = req.body.emailOrPhone;
  let model = req.body.model;

  //   console.log(encryptedPassword);
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        throw error;
      }
      console.log("Connected successfully to server");
      const dbName = db.db("customerDetails");
      let query = { EmailOrPhone: emailOrPhone };

      dbName
        .collection("registerDetails")
        .find(query)
        .toArray()
        .then((collection) => {
          // console.log(collection);
          if (collection.length !== 0) {
            res.send("email or phone already registered");
            console.log("email or phone already registered");
            db.close();
            return true;
          } else {
            let query = {
              currentStatus: false,
            };
            dbName
              .collection(model)
              .find(query)
              .toArray()
              .then((items) => {
                // console.log(items);
                dbName
                  .collection("registerDetails")
                  .insertOne({
                    Username: userName,
                    EmailOrPhone: emailOrPhone,
                    Model: model,
                    Password: encryptedPassword,
                    Items: items,
                  })
                  .then((collection) => {
                    if (!collection.result.ok) {
                      console.error("registration failed please try again");
                      res.send("registration failed please try again");
                    } else {
                      console.log(collection.result);
                      res.send("successfully registered");
                    }
                    db.close();
                    return true;
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              });
          }
        });
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

////////////////////////////**********?Api for Login**********////////////////////////////////////
router.post("/login", (req, res) => {
  let userName = req.body.userName;
  let password = req.body.password;
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        res.send("Server error");
        return true;
      }
      console.log("Connected successfully to server");
      const dbName = db.db("customerDetails");
      let query = { Username: userName };
      dbName
        .collection("registerDetails")
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection.length);
          if (collection.length === 0) {
            console.log("User not registered Please sign up first");
            res.send({
              auth: false,
              message: `User not registered Please sign up first`,
            });
          } else {
            collection.forEach((element) => {
              if (bcrypt.compareSync(password, element.Password)) {
                let jwtPublicKey = {
                  Username: element.Username,
                  Password: element.Password,
                };
                let token = jwt.sign(jwtPublicKey, jwtPrivateKey, {
                  expiresIn: 43200,
                });
                res.send({ auth: true, Token: token });
                db.close();
              }
            });
          }
          return true;
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

//////////////////////////**********?Api for Adding Display Items**********/////////////////////////////////

router.get("/display", middleware.authentication, (req, res) => {
  console.log("user logged");
  // console.log(res.locals);
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        throw error;
      } else {
        console.log("Connected successfully to server");
        const dbName = db.db("customerDetails");
        let query = {
          Username: res.locals.Username,
          Password: res.locals.Password,
        };
        dbName
          .collection("registerDetails")
          .find(query)
          .toArray()
          .then((collection) => {
            // console.log(collection[0].Items);
            res.json(collection[0].Items);
            db.close();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return true;
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

//////////////////////////**********?Api for Adding Item**********/////////////////////////////////

router.put("/main/addItem", middleware.authentication, (req, res) => {
  console.log(req.body);
  let item = req.body;
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        throw error;
      } else {
        // let collectionName = "registerDetails";

        console.log("Connected successfully to server");
        const dbName = db.db("customerDetails");

        async function getNextSequenceValue(productid) {
          // console.log(productid);
          let query = { _id: productid };
          const collection = await dbName
            .collection(item.model)
            .findOneAndUpdate(
              query,
              { $inc: { sequence_value: 1 } },
              { new: true }
            );
          return await collection.value.sequence_value;

          //*! alternate methord//////////////////////////////
          // .then((collection) => {
          //   console.log(collection.value.sequence_value);
          //   return collection.value.sequence_value;
          // })
          // .catch((error) => {
          //   console.log("error" + error);
          // });
        }
        getNextSequenceValue("productid")
          .then((id) => {
            item._id = id;
            console.log("Outside" + id);
            dbName
              .collection(item.model)
              .insertOne(item)
              .then((collection) => {
                // console.log(collection.ops);
                let query = {
                  Username: res.locals.Username,
                  Password: res.locals.Password,
                };
                dbName
                  .collection("registerDetails")
                  .findOneAndUpdate(
                    query,
                    { $push: { Items: item } },
                    { new: true }
                  )
                  .then((collection) => {
                    console.log(collection.value.Items);
                    res.send("Item added to your list");
                    db.close();
                  });
              });
          })
          .catch((error) => {
            console.log(error);
          });

        //

        return true;
      }
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

//////////////////////////**********?Api for Save list**********/////////////////////////////////

router.put("/main/savelist", middleware.authentication, (req, res) => {
  console.log(req.body);
  let savedItem = req.body;
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        throw error;
      } else {
        // let collectionName = "registerDetails";
        console.log("Connected successfully to server");
        const dbName = db.db("customerDetails");
        let query = {
          Username: res.locals.Username,
          Password: res.locals.Password,
        };
        dbName
          .collection("registerDetails")
          .findOneAndUpdate(
            query,
            { $push: { savedList: savedItem } },
            { new: true }
          )
          .then((collection) => {
            console.log(collection.value.Items);
            res.send("Item added to your list");
            db.close();
          });
      }
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

//////////////////////////**********?Api for display Saved list**********/////////////////////////////////

router.get("/main/display/savelist", middleware.authentication, (req, res) => {
  console.log("user logged");
  // console.log(res.locals);
  try {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, db) => {
      if (error) {
        throw error;
      } else {
        console.log("Connected successfully to server");
        const dbName = db.db("customerDetails");
        let query = {
          Username: res.locals.Username,
          Password: res.locals.Password,
        };
        dbName
          .collection("registerDetails")
          .find(query)
          .toArray()
          .then((collection) => {
            console.log(collection[0].savedList);
            res.json(collection[0].savedList);
            db.close();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return true;
    });
  } catch (error) {
    console.error("catched error while attempted to connect the db" + error);
  }
});

router.post("*", (req, res) => {
  res.send("No root available");
});

router.get("*", (req, res) => {
  res.send("No root available");
});

module.exports = router;
