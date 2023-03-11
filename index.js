("use strict");
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
// const { connectDB, db } = require("./db");
const songRoutes = require("./routes/songs.routes");
const notificationRoutes = require("./routes/notifications.routes");
const staticRoutes = require("./routes/static.routes");
const blogRoutes = require("./routes/blogs.routes");
const staticAyushRoutes = require("./routes-ayush/static.routes");
const blogAyushRoutes = require("./routes-ayush/blogs.routes");
const { hash, verifyHash } = require("./utils/index");
// const cors = require("cors");
// const serverless = require("serverless-http");

// require("dotenv").config();

app.use(cors());
require("dotenv").config();
app.use(express.json());

app.use("/api/v1", staticRoutes);
app.use("/api/v1/ayush", staticRoutes);
app.use("/api/v1/ayush/blogs", blogRoutes.router);

app.use("/api/v1/songs", songRoutes.router);
app.use("/api/v1/notifications", notificationRoutes.router);
app.use("/api/v1/blogs", blogRoutes.router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/hash", async (req, res) => {
//   // const password = "password";
//   const token = process.env.TOKEN;
//   const hashedToken = await hash(token);
//   const verify = await verifyHash(token, hashedToken);
//   res.json({ token, hashedToken, verify });
//   // res.send(hashedPassword, verify);
// });

app.get("/connect", async (req, res) => {
  res.send("Connected to Cassandra");
});

app.listen(4000, () => {
  // connectDB();
  console.log("DB Connected");
  console.log("Example app listening on port 4000!");
});

module.exports = app;
// module.exports.handler = serverless(app);
