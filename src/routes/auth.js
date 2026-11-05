const express = require("express");
const router = express.Router();
const Validations = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth");

router.post("/signup", async (req, res) => {
  try {
    Validations.validateSignup(req);
    const encryptedPwd = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: encryptedPwd });
    await user.save();
    const jwToken = await user.getJwt();
    console.log("jwtoken", jwToken);
    res
      .cookie("authToken", jwToken)
      .status(201)
      .send("User added successfully");
  } catch (err) {
    res.status(400).send("Couldn't sign up: " + err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user?.emailId) {
      // throw new Error("User not found"); // Gives out info if the user is registered on the platform
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      // throw new Error("Password isn't correct"); // Gives out info if the user is registered on the platform
      throw new Error("Invalid credentials");
    }

    const jwToken = await user.getJwt();
    res
      .cookie("authToken", jwToken, { maxAge: 2000000 })
      .status(200)
      .send("Login successful!");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("authToken").status(200).send("Logged out successfully!");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

module.exports = router;
