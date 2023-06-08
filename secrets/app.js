//jshint esversion:6
require("dotenv").config(); // load environment variables from a .env file into process.env
const express = require("express"); // include express library for server setup
const bodyParser = require("body-parser"); // include body-parser to parse incoming request bodies
const ejs = require("ejs"); // include ejs for embedding JavaScript in HTML templates
const mongoose = require("mongoose"); // include mongoose for MongoDB object modeling
const passport = require("passport"); // include passport for user authentication
const passportLocalMongoose = require("passport-local-mongoose"); // include passport-local-mongoose for Passport-Local Mongoose strategy
const session = require("express-session"); // include express-session for session middleware
const GoogleStrategy = require("passport-google-oauth20").Strategy; // include passport-google-oauth20 for Google OAuth 2.0 authentication strategy
const findOrCreate = require("mongoose-findorcreate"); // include mongoose-findorcreate for Mongoose findOrCreate plugin

const app = express(); // create an express application

app.use(express.static("public")); // serve static files in the 'public' directory
app.set("view engine", "ejs"); // set view engine to 'ejs'
app.use(bodyParser.urlencoded({ extended: true })); // use bodyParser middleware to parse incoming request bodies

app.use(
  // use express-session middleware
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); // initialize Passport authentication middleware
app.use(passport.session()); // use Passport session middleware

mongoose.connect("mongodb://localhost:27017/userDB"); // connect to MongoDB at the specified URI

// define a Mongoose schema for User model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose); // add passport-local-mongoose plugin to the schema
userSchema.plugin(findOrCreate); // add findOrCreate plugin to the schema

const User = new mongoose.model("User", userSchema); // create a User model

passport.use(User.createStrategy()); // create a local authentication strategy

// serialize user instance to the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserialize user instance from the session
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// create a Google OAuth 2.0 authentication strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// handle logout requests
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// handle registration requests
app.post("/register", function (req, res) {
  User.register({ username: req.body.username }, req.body.password, function (
    err,
    user
  ) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

// handle login requests
app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

// render home page
app.get("/", function (req, res) {
  res.render("home");
});

// handle Google authentication requests
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// handle Google authentication callback requests
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to secrets page.
    res.redirect("/secrets");
  }
);

// render login page
app.get("/login", function (req, res) {
  res.render("login");
});

// render registration page
app.get("/register", function (req, res) {
  res.render("register");
});

// handle requests for the secrets page
app.get("/secrets", function (req, res) {
  User.find({ secret: { $ne: null } })
    .then((foundUsers) => {
      if (foundUsers) {
        foundUsers.secret = submittedSecret;
        res.render("secrets", { usersWithSecrets: foundUsers });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;

  User.findById(req.user.id)
    .then((foundUser) => {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        return foundUser.save();
      } else {
        throw new Error("User not found");
      }
    })
    .then(() => {
      res.redirect("/secrets");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
});

// start the server
app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
