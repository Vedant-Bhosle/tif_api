const mongoose = require("mongoose");
const { Schema } = mongoose;
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
const Role = new mongoose.model("Role", RoleSchema);
module.exports = Role;
