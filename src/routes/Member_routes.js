const express = require("express");
require("dotenv").config();
const jwtdecode = require("jwt-decode");
const auth = require("../middleware/auth");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User/users");
const Member = require("../models/Member/Members");
const Role = require("../models/Role/roles");
const Community = require("../models/Community/Community");

//Add Member

router.post("/", auth, async (req, res) => {
  try {
    const { community, user, role } = req.body;
    if (!community || !user || !role) {
      return res.send("Feilds should not be empty");
    }

    const currole = await Role.findOne({ _id: role });
    console.log(currole);

    if (!currole) {
      return res.send("wrong community id");
    }
    if (currole.name !== "Community Admin") {
      return res.send("NOT_ALLOWED_ACCESS");
    }

    const newMember = new Member({ community, user, role });

    await newMember.save();

    const curmember = await Member.findOne({ community: community });

    res.send({
      status: true,
      content: {
        data: curmember,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

//Delete Member

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.params.id == null) {
      return res.send("Please add id in url");
    }

    const mycommunity = await Community.findOne({ owner: req.user._id });

    let delmember = await Member.findOne({ user: req.params.id });
    console.log(mycommunity._id);
    console.log(delmember.community);
    if (mycommunity._id.equals(delmember.community)) {
      //it means i am the owner of the community of which this member belongs to
      console.log("hello");
      await Member.deleteOne({ user: req.params.id });
      return res.send({ status: true });
    }

    res.send("you can not remove memeber you are not admin");
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
