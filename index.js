const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 3001;

const Token = require("./middleware/token");
const router = require("./router/static");
////////////////// modal data from db //////////////////
module.exports.data = {
  id: "1234567890",
  userName: "sidhik",
  password: "letmein",
  items: [
    {
      Boost: {
        quantity: "1kg",
        rate: "300 rs",
      },
    },
  ],
};

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use("/todoapp", router);

app.listen(port, () => {
  console.log(`Server listen at port ${port}`);
});
