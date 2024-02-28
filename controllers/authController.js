
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cookie=require('cookie')

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const nodemailerTransporter = nodemailer.createTransport({
  // Configure nodemailer transporter here
});

const registerUser = async (req, res) => {
  try {
    const { userName, email, conformPassword, role } = req.body;
    // Check if name was entered
    if (!userName) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Check password
    if (!conformPassword || conformPassword.length < 6) {
      return res
        .status(400)
        .json({
          error: "Password is required and must be at least 6 characters long",
        });
    }
    // Check email
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please try a new email" });
    }
    const hashedconformPassword = await bcrypt.hash(conformPassword, 10);
    const user = await User.create({
      userName,
      email,
      conformPassword: hashedconformPassword,
      role,
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "1d",
    });

    // Send token in response
    // return res.json({ token });
    res.cookie('token',token,{httpOnly:true,maxAge:360000})
    return res.json({message:"login succesfully"})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }

    // Generate reset password token
    const resetToken = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "1h",
    });

    // Send email with reset password link including the token
    const resetLink = `http://127.0.0.1:587/resetPassword/${resetToken}`; // Update the URL with your actual reset password endpoint
    const mailOptions = {
      from: "sadanandsidhu@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Please click on the following link to reset your password: ${resetLink}`,
    };
    
    nodemailerTransporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: "Reset password link sent to your email" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify reset password token
    const decoded = jwt.verify(resetToken, jwtSecretKey);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  login,
  resetPassword,
  setPassword,
};
