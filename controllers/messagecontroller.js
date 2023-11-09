const bcrypt = require("bcryptjs");
const User = require("../models/usersmodel");
const Message = require("../models/messagemodel");

const messageController = {
  // Display users create form on GET.
  message_create_get: async (req, res) => {
    res.render("new_message", { title: "Create a new message" });
  },
  message_delete_post: async (req, res, next) => {
    try {
      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      // Save the message to the database
      // await Message.deleteOne(_id : mid);
      if (req.user.isadmin === "true") {
        await Message.findByIdAndRemove(req.body.mid);
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }

      // Send a success response
      // res.render("index", { title: "Message created successfully!" });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
  message_create_post: async (req, res, next) => {
    try {
      const { title, text } = req.body;

      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      // Create a new message
      const newMessage = new Message({
        title,
        text,
        user: req.user._id, // Set the user field to the current user's ID
      });

      // Save the message to the database
      await newMessage.save();

      // Send a success response
      // res.render("index", { title: "Message created successfully!" });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
  message_show: async (req, res) => {
    try {
      // Search for all messages, ordered by timestamp (descending)
      const messages = await Message.find().sort({ timestamp: -1 }).populate("user").exec();

      // Format the messages array to include the posted by and posting time
      const formattedMessages = messages.map((message) => {
        if (req.isAuthenticated()) {
          return {
            extraClass: req.user.isadmin === "true" ? "" : "disabled",
            id: message._id,
            title: message.title,
            text: message.text,
            postedBy: message.user.firstName, // Assuming the user model has a username property
            postingTime: message.timestamp.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }),
            url: message.url,
          };
        } else {
          return {
            extraClass: "disabled",
            id: message._id,
            title: message.title,
            text: message.text,
            postedBy: "Visible while logged in", // Assuming the user model has a username property
            postingTime: "Visible while logged in",
            url: message.url,
          };
        }
      });

      res.render("index", { title: "All Messages", messages: formattedMessages });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = messageController;
