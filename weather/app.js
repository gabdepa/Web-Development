// Libs required
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// Activate express.js
const app = express();
// Activate body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Port used for express.js
const port = "3000";

//My API key on OpenWeather
const API_KEY = "bff3d416c250e41bf2db653c65f24338";

// Send "index.html" file when receive a "get"
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

// Configure post
app.post("/", function (req, res) {
    // Print which city user typed
    console.log(req.body.cityName);
    // Which city
    const query = req.body.cityName;
    // Which parameters
    const unit = "metric";
    // URL of OpenWeather API
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + API_KEY + "&units=" + unit;
    // Perfoming a GET request on the OpenWeather URL
    https.get(url, function (response) {
        // Print the status received of the get
        console.log(response.statusCode);
        // On received response from API
        response.on("data", function (data) {
            // Modify from hexadecimal to JSON
            const weatherData = JSON.parse(data);
            // Get key temp associated with current temperature
            const temp = weatherData.main.temp;
            // Get key description associated with the description of the current weather
            const weatherDescription = weatherData.weather[0].description
            // Get key icon related with the current temperature
            const icon = weatherData.weather[0].icon;
            // Get image associated with icon
            const imageURL = "http://openweathermap.org/img/wn" + icon + "@2x.png"
            // Write info taken from API to our website
            res.write("<h1>The tempetarue in " + query + " is " + temp + " degrees Celcius</h1>");
            res.write("<img src=" + imageURL + ">");
            res.write("<p>The Weather is currently " + weatherDescription + "</p>");
            //Send info written from API to our client     
            res.send();
        })
    });
});

// Configure Listening
app.listen(port, function () {
    // Print in which port server is running
    console.log("Server running on port " + port);
})