const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./src/db/db");
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const roleroute = require("./src/routes/Role_routes");
const userroutes = require("./src/routes/User_routes");
const Communityroutes = require("./src/routes/Community_routes");
const Memberroutes = require("./src/routes/Member_routes");

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/v1/role", roleroute);
app.use("/v1/auth", userroutes);
app.use("/v1/community", Communityroutes);
app.use("/v1/member", Memberroutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
