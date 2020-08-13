const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.PORT || 3001;

const router = require("./router/static");

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use("/todoapp", router);

app.listen(port, () => {
  console.log(`Server listen at port ${port}`);
});
