const express = require("express");
const app = express();
const bodyParser = require("body-parser");
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
    { itemName: "Boost", quantity: 1, rate: 300 },
    { itemName: "Horlicks", quantity: 1, rate: 320 },
    { itemName: "Complan", quantity: 1, rate: 280 },
    { itemName: "Bournvita", quantity: 1, rate: 250 },
    { itemName: "Lays", quantity: 0.1, rate: 5 },
    { itemName: "Kurkure", quantity: 0.1, rate: 5 },
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
