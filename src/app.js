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

app.post("/signup", async (req, res) => {
  const newUser = {
    firstName: "Saahil",
    lastName: "Madaan",
    emailId: "saahil@gmail.com",
    password: "123456789",
    age: 29,
    gender: "Male",
  };
  const user = new User(newUser);
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
