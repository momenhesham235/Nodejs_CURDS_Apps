const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (the structure of the data)
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    mobileNumber: String,
    age: String,
    country: String,
    gender: String,
  },
  { timestamps: true }
);

// Create a model based on that schema
const User = mongoose.model("User", userSchema);

// export the model
module.exports = User;
