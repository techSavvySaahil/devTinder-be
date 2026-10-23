const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    const decodedJwt = await jwt.verify(authToken, "SaahilDevTinder");
    const { id } = decodedJwt;
    const user = await User.findOne({ _id: id });
    req.user = user;
    if (user.emailId) next();
    else throw new Error("Session expired. Please login again.");
  } catch (err) {
    res.status(401).send("Session expired. Please login again");
  }
};

module.exports = authMiddleware;
