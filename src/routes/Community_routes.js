const express = require("express");
require("dotenv").config();
const jwtdecode = require("jwt-decode");
const auth = require("../middleware/auth");
const User = require("../models/User/users");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Community = require("../models/Community/Community");
const Member = require("../models/Member/Members");

//Create Community

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (name.length < 2) {
      return res.send({ message: "name should be length of atleast 2" });
    }
    // for autogenerate slug//////////////////////
    let result = " ";

    const charactersLength = name.length;
    for (let i = 0; i < name.length; i++) {
      result += name.charAt(Math.floor(Math.random() * charactersLength));
    }

    const slug = result;
    ///////////////////////////

    const newCommunity = new Community({
      name,
      slug,
      owner: req.user._id,
    });

    await newCommunity.save();

    const currentComunnity = await Community.findOne({
      owner: req.user._id,
      name,
      slug,
    });

    res.send({
      status: true,
      content: {
        data: currentComunnity,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

//Get All Community

router.get("/", async (req, res) => {
  try {
    const communities = await Community.find().populate("owner", "name");

    // Construct the response object
    const response = communities.map((community) => ({
      id: community._id,
      name: community.name,
      slug: community.slug,
      owner: {
        _id: community.owner._id,
        name: community.owner.name,
      },
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    const totalPages_pre = Math.floor(response.length / 10);

    const totalPages =
      response.length % 10 == 0 ? totalPages_pre : totalPages_pre + 1;
    res.send({
      status: true,
      content: {
        meta: {
          total: response.length,
          pages: totalPages,
          page: 1,
        },
        data: response,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

//Get My Owned Community

router.get("/me/owner", auth, async (req, res) => {
  try {
    const mycommunites = await Community.find({ owner: req.user._id });

    const totalPages_pre = Math.floor(mycommunites.length / 10);

    const totalPages =
      mycommunites.length % 10 == 0 ? totalPages_pre : totalPages_pre + 1;

    res.send({
      status: true,
      content: {
        meta: {
          total: mycommunites.length,
          pages: totalPages,
          page: 1,
        },
        data: mycommunites,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

//Get All Members

router.get("/:id/members", async (req, res) => {
  try {
    // console.log(req.params.id);
    const communityName = req.params.id;
    // console.log(communityName);

    // Find the community with the given name
    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // Find all members associated with the community ID
    const members = await Member.find({ community: community._id })
      .populate("user", "name") // Populate the 'user' field with the 'name' property from the 'User' model
      .populate("role", "name"); // Populate the 'role' field with the 'name' property from the 'Role' model

    // Construct the response format
    const response = members.map((member) => ({
      id: member._id,
      community: member.community,
      user: {
        id: member.user._id,
        name: member.user.name,
      },
      role: {
        id: member.role._id,
        name: member.role.name,
      },
      created_at: member.created_at,
    }));
    const totalPages_pre = Math.floor(response.length / 10);

    const totalPages =
      response.length % 10 == 0 ? totalPages_pre : totalPages_pre + 1;
    res.send({
      status: true,
      content: {
        meta: {
          total: response.length,
          pages: totalPages,
          page: 1,
        },
        data: response,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

//Get My joined Community

router.get("/me/member", auth, async (req, res) => {
  try {
    const memberEntries = await Member.find({ user: req.user._id });

    // Extract community IDs from the member entries
    const communityIds = memberEntries.map((entry) => entry.community);

    // console.log(communityIds);

    // Retrieve community details and owner information using populate
    const communities = await Community.find({ _id: { $in: communityIds } })
      .populate("owner", "name") // Populate the 'owner' field with the 'name' property from the 'User' model
      .exec();

    // Construct the response format
    const response = communities.map((community) => ({
      id: community._id,
      name: community.name,
      slug: community.slug,
      owner: {
        id: community.owner._id,
        name: community.owner.name,
      },
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));
    const totalPages_pre = Math.floor(response.length / 10);

    const totalPages =
      response.length % 10 == 0 ? totalPages_pre : totalPages_pre + 1;
    res.send({
      status: true,
      content: {
        meta: {
          total: response.length,
          pages: totalPages,
          page: 1,
        },
        data: response,
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

module.exports = router;
