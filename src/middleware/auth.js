const jwt = require("jsonwebtoken");
const User = require("../models/User/users");
require("dotenv").config();
const auth = async (req, res, next) => {
  try {
    //This is for Auth Using COOKIES //
    // const token = req.cookies.jwt;
    // const verifyuser = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verifyuser);
    // const cur_user = await User.findOne({ _id: verifyuser._id });
    // console.log(cur_user);
    // req.token = token;
    // req.user = cur_user;
    // next();

    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
      //   console.log(err);
      if (err) return res.sendStatus(403);
      //   console.log("user: ", user);
      const cur_user = await User.findOne({ _id: user._id });

      req.user = cur_user;

      next();
    });
  } catch (err) {
    res.status(401).render("autherror");
  }
};

module.exports = auth;
