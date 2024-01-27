const express = require("express");
const router = express.Router();

const Role = require("../models/Role/roles");

// Get All Roles

router.get("/", async (req, res) => {
  try {
    const roleData = await Role.find();

    const totalPages_pre = Math.floor(roleData.length / 10);

    const totalPages =
      roleData.length % 10 == 0 ? totalPages_pre : totalPages_pre + 1;

    res.status(200).send({
      status: true,
      content: {
        meta: {
          total: roleData.length,
          pages: totalPages,
          page: 1,
        },
        data: roleData,
      },
    });
  } catch (error) {
    res.send(error);
  }
});

//Create Role

router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    if (name == null || name.length < 2) {
      return res.json({ message: "Role length must be greater than 1" });
    }

    const newRole = new Role({
      name: name,
    });

    await newRole.save();

    const createdUser = await Role.findOne({ name: name });
    res.status(201).send({
      status: true,
      content: {
        data: {
          createdUser,
        },
      },
    });
  } catch (error) {
    res.send({ error: error });
  }
});

module.exports = router;
