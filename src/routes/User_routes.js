const express = require("express");
require("dotenv").config();
const jwtdecode = require("jwt-decode");
const auth = require("../middleware/auth");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User/users");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.send("feilds should not be empty");
    }

    if (name == null || name.length < 2) {
      return res.status(400).send("name should contain more than 1 character");
    }
    if (password == null || password.length < 6) {
      return res
        .status(400)
        .send("password length should be more than 5 character");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const currentUser = await User.findOne({ email });
    // console.log(currentUser);
    const token = jwt.sign({ _id: currentUser._id }, process.env.SECRET_KEY);

    console.log(currentUser._id);
    const sendingData = {
      id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      created_at: currentUser.created_at,
    };

    res.json({
      status: true,
      content: {
        data: sendingData,
        meta: {
          access_token: token,
        },
      },
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send("feilds should not be empty");
    }

    const userfound = await User.findOne({ email: email });
    // console.log(userfound);
    const isMatch = await bcrypt.compare(password, userfound.password);
    // console.log(isMatch);
    if (isMatch == false) {
      return res.status(404).json({ message: "user not found" });
    }

    const token = await jwt.sign(
      { _id: userfound._id },
      process.env.SECRET_KEY
    );

    //  cookie  ////////
    //this is optional here want to do authentication by storing in cookis but i done in way that mentioned in documentation
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    //////
    console.log(userfound._id);

    const sendingData = {
      id: userfound._id,
      name: userfound.name,
      email: userfound.email,
      created_at: userfound.created_at,
    };
    res.send({
      status: true,
      content: {
        data: sendingData,
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    res.send({
      status: true,
      content: {
        data: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          created_at: req.user.created_at,
        },
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});
module.exports = router;
