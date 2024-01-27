const mongoose = require("mongoose");
const mongoURI = process.env.MOGOURI;
require("dotenv").config();

//this is local database after test we have to add atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connectio is succesful");
  })
  .catch((e) => {
    console.log("NO connection", e);
  });
