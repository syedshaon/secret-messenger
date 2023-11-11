const bcrypt = require("bcryptjs");
const User = require("../models/usersmodel");

const usersController = {
  // Display users create form on GET.
  users_create_get: async (req, res) => {
    res.render("signup", { title: "Sing up to Secret Messenger" });
  },
  joingroup: async (req, res, next) => {
    try {
      const { planet } = req.body;

      // Validate the user input
      if (planet !== "earth") {
        throw new Error("Aliens are not allowed to join this chat group.");
      }
      id = req.session.user._id;

      // Save the user to the database
      const result = await User.updateOne({ _id: id }, { $set: { membershipStatus: "premium" } });

      // Send a success response
      //   res.status(201).send({ message: "User created successfully!" });
      res.render("report", { title: "User updated successfully!" });
    } catch (err) {
      next(err);
    }
  },
  users_create_post: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, rpassword } = req.body;

      // Validate the user input
      if (!firstName || !lastName || !email || !password || !rpassword) {
        throw new Error("Missing required fields");
      }

      // Validate the password

      if (password === email) {
        throw new Error("Can't use the email address as password.");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter");
      }

      if (!/[a-z]/.test(password)) {
        throw new Error("Password must contain at least one lowercase letter");
      }

      if (!/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one number");
      }

      // Ensure passwords match
      if (password !== rpassword) {
        throw new Error("Passwords do not match");
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email is already in use");
      }

      // Save the user to the database
      // await newUser.save();

      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) {
          console.log(err);
        } else {
          // otherwise, store hashedPassword in DB
          const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.email,
            password: hashedPassword,
          });
          const result = await newUser.save();
        }
      });

      // Send a success response
      //   res.status(201).send({ message: "User created successfully!" });
      res.render("report", { title: "User created successfully!" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = usersController;
