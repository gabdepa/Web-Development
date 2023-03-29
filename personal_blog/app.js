//jshint esversion:6

// Importing modules needed
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// New instance of express
const app = express();
// Set to use ejs
app.set('view engine', 'ejs');
// Set to use body-parser module
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Posts of the user
let posts = [];

// Root GET Route
app.get("/", function (req, res) {
    res.render("home",
        {
            homeContent: homeStartingContent,
            posts: posts
        });
});

// Params GET Route
app.get("/posts/:postName", function (req, res) {
    // Get parameter requested and transform it to lower case using lodash module as "_"
    const requestedTitle = _.lowerCase(req.params.postName);

    // For each object in the "posts" array
    posts.forEach(function (post) {
        // Transform to lower case
        let postTitle = _.lowerCase(post.title);
        // Compare if the parameter requested matches the title 
        if (postTitle === requestedTitle) {
            // Render the page with the requested content
            res.render("post",
                {
                    title: post.title,
                    content: post.content
                });
        }
        else {
            console.log("Didn't find a match.");
        }
    });
});

// About GET Route
app.get("/about", function (req, res) {
    res.render("about", { aboutContent: aboutContent });
});

// Contact GET Route
app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
});

// Compose GET Route
app.get("/compose", function (req, res) {
    res.render("compose");
});

// Compose POST Route
app.post("/compose", function (req, res) {
    const post = {
        title: req.body.postTitle,
        content: req.body.postMessage
    };

    // Adding new post created to the list of posts
    posts.push(post);

    //Redirection to Root Route
    res.redirect("/");
});

// Running server status
app.listen(3000, function () {
    console.log("Server running on port 3000");
});
