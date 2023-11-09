const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    virtual: true,
    get() {
      return `/users/${this._id}`;
    },
  },
  membershipStatus: {
    type: String,
    enum: ["trial", "premium"],
    default: "trial",
    required: false,
  },
  isadmin: {
    type: String,
    enum: ["true", "false"],
    default: "false",
    required: false,
  },
});

// Compile the schema into a model
// Export the model
module.exports = mongoose.model("User", userSchema);
