// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const jwtSecretKey = "sadanand"; // Replace with your actual secret key

// const test = (req, res) => {
//   res.json("test is working");
// };

// ////////////////////////signup
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     // Check if name was entered
//     if (!username) {
//       return res.json({
//         error: "name is required",
//       });
//     }
//     // Check password
//     if (!password || password.length < 6) {
//       return res.json({
//         error: "password is required and must be at least 6 characters long",
//       });
//     }
//     // Check email
//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.json({
//         error: "Email already exists. Please try a new email",
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//     });
//     return res.json(user);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// ///////////////////////login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });

//     // If user is not found
//     if (!user) {
//       return res.status(404).json({ error: "user already exist" });
//     }

//     // Compare passwords
//     const passwordMatch = await bcrypt.compare(password, user.password); // Change to user.password

//     // If passwords don't match
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
//       expiresIn: "1h",
//     });

//     // Send token in response
//     return res.json({ token, role: user.role });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   registerUser,
//   login,
// };
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const nodemailerTransporter = nodemailer.createTransport({
  // Configure nodemailer transporter here
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if name was entered
    if (!username) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Check password
    if (!password || password.length < 6) {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
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
      expiresIn: "1month",
    });

    // Send token in response
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset password token
    const resetToken = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "1h",
    });

    // Send email with reset password link
    const resetLink = `http://sarathlalsh@gmail.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: "sarathlalsh@gmail.com",
      to: user.email,
      subject: "Reset Password",
      text: `Please click on the following link to reset your password: ${resetLink}`,
    };
    await nodemailerTransporter.sendMail(mailOptions);

    return res.json({ message: "Reset password link sent to your email" });
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
