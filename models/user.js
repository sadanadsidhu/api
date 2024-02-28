const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String },
  email: { type: String },
  conformPassword: { type: String },
  role:{type:String}

});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
