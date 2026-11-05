const validator = require("validator");

const validateSignup = (req) => {
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

const validateEditProfile = (req) => {
  const AllowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    AllowedFields.includes(key),
  );

  if (!isEditAllowed) {
    throw new Error("Invalid edit not allowed");
  }
};

module.exports = {
  validateSignup,
  validateEditProfile,
};
