const express = require("express");
const router = express.Router();
const cors = require("cors");
// const { test, registerUser, login } = require("../controllers/authController");
const { registerUser, login, resetPassword, setPassword } = require('../controllers/authController');

// Middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);



router.post('/register', registerUser);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/set-password', setPassword);

module.exports = router;
