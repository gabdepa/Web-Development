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

// Define a schema for the 'article' collection
// The schema specifies that each article document will have a 'title' and a 'content' field, both of which are strings
const articleSchema = {
  title: String,
  content: String,
};

// Create an 'Article' model based on the 'articleSchema'
// The model provides an interface for interacting with the 'article' collection in the MongoDB database
// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.
const Article = mongoose.model("Article", articleSchema);

// Handle GET requests to the "/articles" route
app.get("/articles", function (req, res) {
  // Use the Article model to find all articles in the database
  Article.find()
    // Once the find operation is done, this function will be called with the found articles as its argument
    .then(function (foundArticles) {
      // Send the found articles back to the client as the response
      res.send(foundArticles);
    })
    // If an error occurred during the find operation, this function will be called with the error as its argument
    .catch(function (err) {
      // Send the error back to the client as the response
      res.send(err);
      // Handle the error appropriately here
    });
});

// Handle POST requests to the "/articles" route
app.post("/articles", function (req, res) {
  // Create a new article instance using the title and content from the request body
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  // Try to save the new article in the database
  newArticle
    .save()
    // If the article was saved successfully, send a success message to the client
    .then(function () {
      res.send("Successfully added new article!");
    })
    // If an error occurred during the save operation, send the error to the client
    .catch(function (err) {
      res.send(err);
    });
});

// Handle DELETE requests to the "/articles" route
app.delete("/articles", function (req, res) {
  // Use the Article model to delete all documents in the collection
  Article.deleteMany()
    // If the delete operation was successful, send a success message to the client
    .then(function () {
      res.send("Successfully deleted all records!");
    })
    // If an error occurred during the delete operation, send the error to the client
    .catch(function (err) {
      res.send(err);
    });
});

// Make the Express application listen for HTTP requests on port 3000, logging a message to the console once the server is running
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
