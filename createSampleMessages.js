require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Message = require("./models/messagemodel");
const User = require("./models/usersmodel");

const mongoDB = process.env.mongoCon;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const createSampleMessages = async () => {
  try {
    // Get all sample users
    const users = await User.find();

    // Create 50 sample messages
    for (let i = 0; i < 50; i++) {
      // Randomly select a user to be the message author
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const author = users[randomUserIndex];

      // Randomly generate message title, text, and timestamp
      const title = faker.lorem.sentence();
      const text = faker.lorem.paragraph();
      const timestamp = new Date(faker.date.between("2023-01-01", "2023-11-07"));

      // Create a new message
      const newMessage = new Message({
        title,
        text,
        user: author._id, // Set the user field to the author's ID
        timestamp,
      });

      // Save the message to the database
      await newMessage.save();
    }
    console.log("Sample messages created successfully!");
  } catch (err) {
    console.error(err);
  }
};

createSampleMessages();
