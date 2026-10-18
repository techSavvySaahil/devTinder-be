const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/about", (req, res) => {
  res.send("Hello World for about");
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

app.use("/", (req, res) => {
  res.send("Hello World for use");
});

console.log("Hello World");
