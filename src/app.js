const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");

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

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
// const authRouter = require("./routes/auth");

app.use("/", authRouter);
app.use("/", profileRouter);

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
