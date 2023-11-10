require("dotenv").config();

const User = require("../models/usersmodel");

const bcrypt = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const usersController = require("../controllers/userscontroller");
const messageController = require("../controllers/messagecontroller");

// Define a middleware function to check if the user is authenticated
// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/signin"); // Redirect to login page if not authenticated
//   }
// };

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await passport.authenticate("jwt", { session: false });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = decodedToken.user;

  next();
};

async function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

router.post("/signin", async (req, res) => {
  // Get the user credentials from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Find the user by their username
  const user = await User.findOne({ username });

  // If the user is not found, return an error
  if (!user) {
    return res.json({ username });
    // return res.status(404).json({ message: "User not found" });
  }

  // Verify the password
  const match = await bcrypt.compare(password, user.password);

  // If the password is incorrect, return an error
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Generate a JWT token for the user
  const token = await generateToken(user);

  // Set the JWT token in a browser cookie
  res.cookie("token", token, {
    expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
    httpOnly: true,
    secure: true,
  });

  // Send the token to the user
  // return res.json({ token });
  return res.redirect("/");
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: "accounts.examplesoft.com",
  audience: "yoursite.net",
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.sub });

      if (!user) {
        return done(null, false);
      }

      // Set the user property on the request object.
      req.user = user;

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// router.get("/log-out", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
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

const isAuthenticated = async (req, res, next) => {
  // Check the user's session.
  // if (req.session.user) {
  //   return next();
  // }

  // Check the user's cookies.
  const authToken = req.cookies.token;
  // const authToken = document.cookie.match(/token=([^;]+)/)[1];
  // const authToken = req.headers.authorization.split(" ")[1];
  if (authToken) {
    // Validate the auth token.
    const user = await verifyToken(authToken);
    if (user) {
      req.session.user = user;
      res.locals.user = user;
      return next();
    }
  }

  // The user is not authenticated.
  res.status(401).send("Unauthorized");
};

// Following makes user variable available to "/" route

// router.use(async (req, res, next) => {
//   // Check the user's cookies.
//   const authToken = req.cookies.token;
//   // const authToken = document.cookie.match(/token=([^;]+)/)[1];
//   // const authToken = req.headers.authorization.split(" ")[1];
//   if (authToken) {
//     // Validate the auth token.
//     const user = await verifyToken(authToken);
//     if (user) {
//       // req.session.user = user;
//       res.locals.user = user;
//       return next();
//     }
//   }
// });

// Protect a route with JWT authentication
router.get("/protected", async (req, res) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  // Get the user from the decoded token
  const user = await verifyToken(token);

  // User is authenticated
  return res.json({ message: `Welcome, ${user.firstName}.` });
});

// // Following is useful if we just want to very whether the user is authenticated or not

// const sverifyToken = (req, res, next) => {
//   const secret = process.env.JWT_SECRET;
//   const token = req.headers.authorization.split(" ")[1];

//   return new Promise((resolve, reject) => {
//     jwt.verify(token, secret, (err, decodedToken) => {
//       if (err) {
//         // reject(err);
//         return res.json({ message: `error` });
//       } else {
//         // resolve(decodedToken);
//         // return res.json({ message: `works` });
//         next();
//       }
//     });
//   });
// };
// // Protect a route with JWT authentication
// router.get("/secret", sverifyToken, async (req, res) => {
//   // Get the token from the Authorization header
//   // const token = req.headers.authorization.split(" ")[1];

//   // // Verify the token
//   // const decodedToken = await verifyToken(token);

//   // // Get the user from the decoded token
//   // const user = await User.findOne({ _id: decodedToken.id });

//   // User is authenticated
//   // return res.json({ message: `Welcome, ${user.firstName}.` });
//   return res.json({ message: `Welcome, ` });
// });

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get("/", messageController.message_show);

router.get("/signup", usersController.users_create_get);

router.post("/signup", usersController.users_create_post);

router.post("/joingroup", usersController.joingroup);

//  route that requires authentication
router.get("/messages/create", messageController.message_create_get);
// router.get("/messages/create", isAuthenticated, messageController.message_create_get);

router.post("/messages/create", messageController.message_create_post);

router.post("/messages/delete", messageController.message_delete_post);

router.get("/signin", function (req, res, next) {
  res.render("signin", { title: "Sign In to Secret Messenger" });
});

module.exports = router;
