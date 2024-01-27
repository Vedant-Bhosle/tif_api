const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const membersechema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    created_at: {
      type: String,
      default: new Date().toISOString(),
    },
  },
  { versionKey: false }
);

const Member = new mongoose.model("Member", membersechema);
module.exports = Member;
