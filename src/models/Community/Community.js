const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registersechema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    created_at: {
      type: String,
      default: new Date().toISOString(),
    },
    updated_at: {
      type: String,
      default: new Date().toISOString(),
    },
  },

  { versionKey: false }
);

const Community = new mongoose.model("Community", registersechema);
module.exports = Community;
