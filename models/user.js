const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  role:{type:String}

});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
