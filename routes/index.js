const User = require("../models/usersmodel");

const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const usersController = require("../controllers/userscontroller");
const messageController = require("../controllers/messagecontroller");

// Define a middleware function to check if the user is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin"); // Redirect to login page if not authenticated
  }
};

/* GET home page. */
// router.get("/", (req, res) => {
//   res.render("index", usersController.message_show);
// });

router.get("/", messageController.message_show);

router.get("/signup", usersController.users_create_get);

router.post("/signup", usersController.users_create_post);

router.post("/joingroup", usersController.joingroup);

//  route that requires authentication
router.get("/messages/create", isLoggedIn, messageController.message_create_get);

router.post("/messages/create", messageController.message_create_post);

router.post("/messages/delete", messageController.message_delete_post);

router.get("/signin", function (req, res, next) {
  res.render("signin", { title: "Sign In to Secret Messenger" });
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      //   if (user.password !== password) {
      //     return done(null, false, { message: "Incorrect password" });
      //   }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = router;
