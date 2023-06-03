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

// Create a route for "/articles" and chain HTTP methods (GET, POST, DELETE) to it
app
  .route("/articles")
  // Handle GET requests to the "/articles" route
  .get(function (req, res) {
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
      });
  })
  // Handle POST requests to the "/articles" route
  .post(function (req, res) {
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
  })
  // Handle DELETE requests to the "/articles" route
  .delete(function (req, res) {
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

////////////////////////////////////////// Requests targetting a specific article //////////////////////////////////////////

// Begin defining a route handler for routes in the form "/articles/:articleTitle"
app.route("/articles/:articleTitle")
  // Handle GET requests to this route
  .get(function (req, res) {
    // Use the Article model to find one article in the database with a title matching the title provided in the route parameter
    Article.findOne({ title: req.params.articleTitle })
      // Once the find operation is done, this function will be called with the found article as its argument
      .then(function (foundArticle) {
        // Send the found article back to the client as the response
        res.send(foundArticle);
      })
      // If an error occurred during the find operation, this function will be called with the error as its argument
      .catch(function (err) {
        // Send the error back to the client as the response
        res.send(err);
      });
  })
  // Handle PUT requests to the "/article/:articleTitle" route
  .put(function (req, res) {
    // Create an object to hold the fields to be updated
    let updateObject = {};
    // If a title was provided in the request, add it to the update object
    if (req.body.title) {
      updateObject.title = req.body.title;
    }
    // If content was provided in the request, add it to the update object
    if (req.body.content) {
      updateObject.content = req.body.content;
    }
    // Use the Article model to find the document with the specified title and update it
    // Note: req.params.articleTitle contains the title from the request URL
    // Note: the $set operator is used here to update only the specified fields in the document
    Article.updateMany(
      { title: req.params.articleTitle },
      { $set: updateObject }
    )
      // Once the update operation is done, this function will be called
      .then(function () {
        // Send a success message back to the client as the response
        res.send("Successfully updated Article!");
      })
      // If an error occurred during the update operation, this function will be called with the error as its argument
      .catch(function (err) {
        // Send the error back to the client as the response
        res.send(err);
      });
  })
  // Handle PATCH requests to the "/article/:articleTitle" route
  .patch(function (req, res) {
    // Use the Article model to find the document with the specified title and update it
    // Note: req.params.articleTitle contains the title from the request URL
    // Note: req.body contains the fields to be updated and their new values
    // Note: the $set operator is used here to update only the specified fields in the document
    Article.updateMany({ title: req.params.articleTitle }, { $set: req.body })
      // Once the update operation is done, this function will be called
      .then(function () {
        // Send a success message back to the client as the response
        res.send("Successfully updated Article!");
      })
      // If an error occurred during the update operation, this function will be called with the error as its argument
      .catch(function (err) {
        // Send the error back to the client as the response
        res.send(err);
      });
  })
  // Handle DELETE requests to the "/article/:articleTitle" route
  .delete(function (req, res) {
    // Use the Article model to delete the document(s) with the specified title from the database
    // Note: req.params.articleTitle contains the title from the request URL
    Article.deleteOne({ title: req.params.articleTitle })
      // Once the delete operation is done, this function will be called
      .then(function () {
        // Send a success message back to the client as the response
        res.send("Successfully deleted record!");
      })
      // If an error occurred during the delete operation, this function will be called with the error as its argument
      .catch(function (err) {
        // Send the error back to the client as the response
        res.send(err);
      });
  });

// Make the Express application listen for HTTP requests on port 3000, logging a message to the console once the server is running
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
