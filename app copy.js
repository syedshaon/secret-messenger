require("dotenv").config();

const usersController = require("./controllers/userscontroller");

const bcrypt = require("bcryptjs");
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");

// Set up mongoose connection

mongoose.set("strictQuery", false);
const mongoDB = process.env.mongoCon;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connecion error: "));

const User = require("./models/usersmodel");

const app = express();
app.use(cookieParser());
// app.set("views", __dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Following makes user variable available to "/" route

// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

// // Verify a JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        // reject(err);
        const user = false;
        resolve(user);
      } else {
        const user = await User.findOne({ _id: decodedToken.id });
        resolve(user);
      }
    });
  });
};

app.use(async (req, res, next) => {
  // Check the user's cookies.

  // const authToken = document.cookie.match(/token=([^;]+)/)[1];
  // const authToken = req.headers.authorization.split(" ")[1];
  if (req.cookies.token) {
    const authToken = req.cookies.token;
    // Validate the auth token.
    const user = await verifyToken(authToken);
    if (user) {
      req.session.user = user;
      res.locals.user = user;
      return next();
    }

    res.locals.user = req.user;
    next();
  } else {
    res.locals.user = req.user;
    next();
  }
});

app.use("/", indexRouter);

// app.get("/", (req, res) => {
//   res.render("index", { user: req.user, title: "Secret Messenger" });
// });

// app.get("/signup", usersController.users_create_get);

// app.post("/signup", usersController.users_create_post);

// app.get("/signin", function (req, res, next) {
//   res.render("signin", { title: "Sign In to Secret Messenger" });
// });

// app.post(
//   "/signin",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/signin",
//   })
// );

// app.get("/log-out", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });
//       if (!user) {
//         return done(null, false, { message: "Incorrect email" });
//       }
//       //   if (user.password !== password) {
//       //     return done(null, false, { message: "Incorrect password" });
//       //   }
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         // passwords do not match!
//         return done(null, false, { message: "Incorrect password" });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error!" });
});

module.exports = app;
