const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

// New Instance of express
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extende: true }));
app.use(express.static("public"));

// Connecting to DB
mongoose.connect("mongodb://localhost:27017/todoListDB", { useNewUrlParser: true });

// Mongoose Schema
const itemsSchema = {
    name: String
};

// Mongoose model
const Item = mongoose.model("Item", itemsSchema);

// Creating items
const item1 = new Item({
    name: "Welcome to your todoList!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Array of the default items
const defaultItems = [item1, item2, item3];

// Root Route
app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            // Added elements if there is no items yet
            Item.insertMany(defaultItems);
            // Redirect back to the Root Route
            res.redirect("/");
        }
        else {
            // Render "list.ejs" file
            res.render("home", { listTitle: "Today", newListItems: foundItems.name });
        }
    });


});

// Differente params Route
app.get("/:customListName", function (req, res) {
    // Get the parameter passed
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                // Save the created list
                list.save();
                // Redirect user to the List
                res.redirect("/" + customListName);
            }
            else {
                // Show existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    })



});

// Main Post Route
app.post("/", function (req, res) {

    // Get the name of the new item inserted
    const itemName = req.body.newItem;
    // Get the list name of the item inserted
    const listName = req.body.list;
    // Creating new document for MongoDB
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        // Save to the DB
        item.save();
        // Redirect to Root Route to render
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

// Main Delete items route
app.post("/delete", function (req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID, function (err) {
            if (!err) {
                console.log("Successfully deleted");
                res.redirect("/" + listName);
            } 
        });
    }
    else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemID } } },
            function (err, foundList){
                if(!err){
                    res.redirect("/" + listName);
                }
            });
    }
});

// About Route
app.get("/about", function (req, res) {
    res.render("about", { listTitle: "About List", newListItems: workItems });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});