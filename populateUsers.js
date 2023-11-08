const mongoose = require("mongoose");
const User = require("./models/usersmodel");

mongoose.connect("mongodb+srv://syedshaon99:PzdX1XwhEmiJHskf@messenger.zk0vnpz.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sampleUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe@example.com",
    password: "password123",
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    username: "janedoe@example.com",
    password: "password456",
  },
  {
    firstName: "Peter",
    lastName: "Jones",
    username: "peterjones@example.com",
    password: "password789",
  },
  {
    firstName: "Mary",
    lastName: "Smith",
    username: "marysmith@example.com",
    password: "password101112",
  },
  {
    firstName: "David",
    lastName: "Williams",
    username: "davidwilliams@example.com",
    password: "password131415",
  },
  {
    firstName: "Sarah",
    lastName: "Brown",
    username: "sarahbrown@example.com",
    password: "password161718",
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    username: "michaeljohnson@example.com",
    password: "password192021",
  },
  {
    firstName: "Jennifer",
    lastName: "Taylor",
    username: "jennifertaylor@example.com",
    password: "password222324",
  },
  {
    firstName: "Mark",
    lastName: "Anderson",
    username: "markanderson@example.com",
    password: "password252627",
  },
  {
    firstName: "Susan",
    lastName: "Thomas",
    username: "susanthomas@example.com",
    password: "password282930",
  },
];

const createSampleUsers = async () => {
  try {
    for (const sampleUser of sampleUsers) {
      const newUser = new User(sampleUser);
      await newUser.save();
    }
    console.log("Sample users created successfully!");
  } catch (err) {
    console.error(err);
  }
};

createSampleUsers();
