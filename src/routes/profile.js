const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth");
const Validations = require("../utils/validations");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName } = req.user;
    res.status(200).send("Hello " + firstName + " " + lastName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    Validations.validateEditProfile(req);
    const localUser = await User.findOne({ emailId: req.user.emailId });

    Object.keys(req.body).forEach((key) => (localUser[key] = req.body[key]));
    await localUser.save();
    const { firstName, lastName } = req.user;
    res
      .status(200)
      .send(
        "Your profile has been successfully updated, " +
          firstName +
          " " +
          lastName,
      );
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
