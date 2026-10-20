const express = require("express");
const authMiddleware = require("./middlewares/auth");
const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use(authMiddleware);

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

app.get(/.*fly$/, (req, res) => {
  console.log(req);
  console.log(req.query);
  const { id = null } = req.query;
  res.send(`Hello World for ${req.url} and id is ${id}`);
});

app.get("/:id", (req, res) => {
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
