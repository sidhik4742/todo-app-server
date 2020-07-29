const express = require ('express');
const router = express.Router();

const Token = require('../middleware/token');
const modalData = require('../index');

let middlewareparam = [Token]

router.post("/login",middlewareparam, (req,res) => {
    console.log("login form data");
    console.log(req.body);
    res.json(modalData.data);

});

router.get("/display",(req, res) => {
    res.json(modalData.data);
    console.log(modalData.data);
});

router.post("*",(req,res) => {
    res.send("No root available");
});

router.get('*',(req,res)=>{
    res.send("No root available")
})

module.exports = router;