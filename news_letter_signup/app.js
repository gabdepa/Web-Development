// -------------- INIT SECTION
// Libraries requested
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// Instance of express.js
const app = express();
// Use local files to send to use on server
app.use(express.static("public"));
// Use body-parser lib
app.use(bodyParser.urlencoded({ extended: true }));

// -------------- INIT SECTION

// Configure get to home route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// Configure post to home route
app.post("/", function (req, res) {
    // Get inputs from html body typed by user
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // Create JSON object "data" with input provided by the user
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // Turn "data" into string format
    const jsonData = JSON.stringify(data);
    // My unique id on mailchimp
    const myId = "4e0e71fb3d";
    // My API_KEY on mailchimp
    const apiKey = "798efb66ddfdb2c1c6f5d32c97bafbd4-us11";
    // URL of my mailchimp
    const url = "https://us11.api.mailchimp.com/3.0/lists/" + myId;
    // Options
    const options = {
        method: "POST", // Method utilized
        auth: "gabdepa:" + apiKey // User:API_KEY 
    };
    // Make request
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        // Print the response from mailchimp server
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    // Send the request with our data to mailchimp
    // request.write(jsonData);
    // End the request
    request.end();
});
// TYPE OF REQUEST
// curl --request POST \
// --url "https://usX.api.mailchimp.com/3.0/lists/" \
// --user "key:$API_KEY" \
// --header 'content-type: application/json' \
// --data '{  "email_address": "$user_email",  "status": "subscribed",  "merge_fields": {"FNAME": "$user_fname",	"LNAME": "$user_lname"}}
// --include

// Redirect User in case of failed subscription
app.post("/failure", function (req, res) {
    res.redirect("/");
});

// Configure server to listen
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running");
});

