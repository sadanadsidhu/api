const dotenv = require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database is connected"));

app.use(express.json());
app.use("/", require("./routes/authRoutes"));
app.use('/', require("./routes/adminHomePageRoutes"));


const port = 2124;
app.listen(port, () => console.log(`Server is running on port ${port}`));
