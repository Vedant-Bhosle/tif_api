const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registersechema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: String,
      default: new Date().toISOString(),
    },
  },
  { versionKey: false }
);

const User = new mongoose.model("User", registersechema);
module.exports = User;
