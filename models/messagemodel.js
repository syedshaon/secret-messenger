const mongoose = require("mongoose");
const User = require("./usersmodel");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,

    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Make the url field virtual
  url: {
    type: String,
    virtual: true,
    get() {
      return `/messages/${this._id}`;
    },
  },
});

module.exports = mongoose.model("Message", messageSchema);

// module.exports = Message;
