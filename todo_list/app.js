const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// New Instance of express
const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extende: true }));
app.use(express.static("public"));

// Root Route
app.get("/", function (req, res) {
    const day = date.getDay();

    // Render "list.ejs" file
    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {

    const item = req.body.newItem;

    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }
});

// Work Route
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
    const workItem = req.body.newItem;

    workItems.push(workItem);

    res.redirect("/work");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});