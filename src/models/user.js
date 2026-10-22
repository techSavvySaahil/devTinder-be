const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email id " + value);
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 75,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Invalid Gender data");
        }
      },
      lowercase: true,
    },
    about: {
      type: String,
      default: "This is the default about",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
