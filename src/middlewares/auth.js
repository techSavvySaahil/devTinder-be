const authMiddleware = (req, res, next) => {
  console.log("Hello World for use 1");
  if (!req.headers.token || req.headers.token === "1234567890") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = authMiddleware;
