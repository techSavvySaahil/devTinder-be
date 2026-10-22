const express = require("express");
const authMiddleware = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const Validations = require("./utils/validations");
const bcrypt = require("bcrypt");

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

app.use(authMiddleware);
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    Validations.signUpValidation(req);
    const encryptedPwd = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: encryptedPwd });
    await user.save();
    res.status(201).send("User added successfully");
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
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // throw new Error("Password isn't correct"); // Gives out info if the user is registered on the platform
      throw new Error("Invalid credentials");
    }
    res.status(200).send("Login successful");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
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

app.get(/.*fly$/, (req, res, next) => {
  const { id = null } = req.query;
  // res.send("Hello");
  try {
    throw new Error("Issue in a function");
  } catch (err) {
    // res.send(`Hello World for ${req.url} and id is ${id}`);
    next(err);
  }
});

app.use("/:id", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal server error");
  }
  if (req.headers.token === "1234567890") {
    const { id } = req.params;
    res.send(`Hello World for ${req.url} and id is ${id}`);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.post("/about", (req, res) => {
  res.send("Data submitted successfully via POST request");
});

app.put("/about", (req, res) => {
  res.send("Data updated successfully via PUT request");
});

app.delete("/about", (req, res) => {
  res.send("Data deleted successfully via DELETE request");
});

console.log("Hello World");
