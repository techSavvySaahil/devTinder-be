const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/about", (req, res) => {
  res.send("Hello World for about");
});

app.use("/", (req, res) => {
  res.send("Hello World for use");
});

console.log("Hello World");
