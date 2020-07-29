const modalData = require("../index");

function Token(req, res, next) {
  console.log("creating token");
  console.log(modalData.data);
  if (
    modalData.data.userName === req.body.userName &&
    modalData.data.password === req.body.password
  ) {
      modalData.data.Token = req.body.Token;
    console.log("user logged");
    next();
    return true;
  }
  res.send("login failed");
}

module.exports = Token;
