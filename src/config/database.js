const mongoose = require("mongoose");
const { webcrypto } = require("crypto");
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = webcrypto;
}

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://saahilmadaan_db_user:<db_password>@nodepractice.yoaxgpb.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
