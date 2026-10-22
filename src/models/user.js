const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
      max: 75,
    },
    gender: {
      type: String,
      trim: true,
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
