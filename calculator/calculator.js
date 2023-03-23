// Load npm packages
const express = require("express");
const  bodyParser = require("body-parser");

// Use express.js
const app = express();
// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.listen("3000", function() {
    console.log("Server is running on port 3000");
});

app.get("/bmicalculator", function(req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", function(req, res) {
    var wheight = parseFloat(req.body.wheight);
    var height = parseFloat(req.body.height);

    var bmi = wheight / (height * height);

    console.log(bmi);
    res.send("Your BMI is " + bmi);
});

