//jshint esversion:6
// Import Express, a Node.js web application framework
const express = require("express");
// Import Body-Parser, a middleware used for handling JSON, Raw, Text and URL encoded form data.
const bodyParser = require("body-parser");
// Import EJS (Embedded JavaScript templates) a templating engine used to generate HTML markup with plain JavaScript.
const ejs = require("ejs");
// Import Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straight-forward, schema-based solution to model application data.
const mongoose = require("mongoose");
// Initialize an Express application.
const app = express();
// Set the view engine of the Express application to EJS, allowing Express to render EJS templates
app.set("view engine", "ejs");
// Use Body-Parser in the Express application
app.use(
  bodyParser.urlencoded({
    extended: true, // The "extended: true" option allows the parsing of extended URL-encoded data.
  })
);
// Use Express's built-in middleware function to serve static files, in this case from the "public" directory
app.use(express.static("public"));
// Use 'dotenv' package to load environment variables from a .env file into process.env
require("dotenv").config();
// Connect to the MongoDB database with a connection string stored in the MONGO_URL environment variable, while setting 'useNewUrlParser' to true for MongoDB driver's new URL string parsing
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
// Make the Express application listen for HTTP requests on port 3000, logging a message to the console once the server is running
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
