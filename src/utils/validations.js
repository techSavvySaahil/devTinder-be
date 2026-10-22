const validator = require("validator");

const signUpValidation = (req) => {
  const { emailId, password, gender } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id " + emailId);
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password not strong");
  }
  if (!["male", "female", "others"].includes(gender.toLowerCase())) {
    throw new Error("Invalid Gender data");
  }
};

module.exports = {
  signUpValidation,
};
