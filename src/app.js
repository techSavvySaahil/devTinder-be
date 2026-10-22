const express = require("express");
const authMiddleware = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

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
  const newUser = {
    firstName: "Saahil",
    lastName: "Madaan",
    emailId: "saahil@gmail.com",
    password: "123456789",
    age: 29,
    gender: "Male",
  };
  console.log("Check req", req);
  console.log("Check body", req.body);
  // const user = new User(newUser);
  // data from request needs validation also
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    console.log("Error happened", err);
    res.status(500).send("Something went wrong");
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
  console.log("Req params", req.params);
  console.log("Req params", req.query);
  const { emailId } = req.query;
  const filter = emailId ? { emailId } : {};
  console.log("Req emailId", emailId);
  try {
    const foundUser = await User.find(filter);
    if (foundUser.length === 0) {
      throw new Error("User not found");
    }
    console.log("Found user", foundUser);
    res.status(200).send(foundUser);
  } catch (err) {
    console.log("Some issue here", err);
    res.status(404).send("User not found");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log("Deleted user", deletedUser);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(404).send("User not found.");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      req.body,
      { returnDocument: "after" },
    );
    console.log("Updated user", updatedUser);
    res.status(200).send("User updated successfully", updatedUser);
  } catch (err) {
    console.log("Error", err);
    res.status(404).send("User not found.");
  }
});

app.get(/.*fly$/, (req, res, next) => {
  console.log(req);
  console.log(req.query);
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
  // console.log(req);
  if (req.headers.token === "1234567890") {
    // next();
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
