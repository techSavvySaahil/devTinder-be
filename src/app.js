const express = require("express");
const authMiddleware = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const Validations = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("DB connection not established", err);
  });

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    Validations.signUpValidation(req);
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

app.post("/login", async (req, res) => {
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
      .cookie("authToken", jwToken, { maxAge: 20000 })
      .status(201)
      .send("Login successful!");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName } = req.user;
    res.status(200).send("Hello " + firstName + " " + lastName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get(
  /^\/ab(ou)?t$/,
  (req, res, next) => {
    console.log("Hello World for about 1");
    next();
  },
  (req, res) => {
    console.log("Hello World for about 2");
    res.send("Hello World. This is the about page");
  },
);

app.get("/user", async (req, res) => {
  // const { emailId } = req.body;
  const { emailId } = req.query;
  const filter = emailId ? { emailId } : {};
  try {
    const foundUser = await User.find(filter);
    if (foundUser.length === 0) {
      throw new Error("User not found");
    }
    res.status(200).send(foundUser);
  } catch (err) {
    res.status(404).send("User not found");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(404).send("User not found.");
  }
});

const ALLOWED_UPDATES = [
  "firstName",
  "lastName",
  "about",
  "age",
  "password",
  "userId",
  "skills",
];

app.patch("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const isUpdateNotAllowed = Object.keys(req.body).some((key) => {
      return !ALLOWED_UPDATES.includes(key);
    });
    if (isUpdateNotAllowed) throw new Error("Update not allowed");
    if (req.body?.skills?.length > 10)
      throw new Error("Max 10 skills can be added");

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      req.body,
      { returnDocument: "after", runValidators: true },
    );
    res.status(200).send("User updated successfully", updatedUser);
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
  }
});

console.log("Hello World");
