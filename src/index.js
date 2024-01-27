const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./db/db");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const roleroute = require("./routes/Role_routes");
const userroutes = require("./routes/User_routes");
const Communityroutes = require("./routes/Community_routes");
const Memberroutes = require("./routes/Member_routes");

app.use("/v1/role", roleroute);
app.use("/v1/auth", userroutes);
app.use("/v1/community", Communityroutes);
app.use("/v1/member", Memberroutes);

app.get("/", (req, res) => {
  console.log(process.env.SECRET_KEY);
  res.send("hello");
});

app.listen(5001, () => {
  console.log("server running on port 5001");
});
