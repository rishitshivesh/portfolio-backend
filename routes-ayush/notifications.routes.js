const Router = require("express").Router;
const router = Router();
const uuid = require("uuid");
// const db = require("../db/index").dbClient;
const db = require("../utils/Dynamo");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const TableName = process.env.TABLE_NAME;
const UserName = process.env.USER_NAME;
require("dotenv").config();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const songs = await db.queryBeginsWith(
      UserName,
      "notifications",
      TableName
    );
    res.json({ data: songs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
  //   res.send("Hello World! Songs are here");
});
router.post("/", isAuthenticated, async (req, res) => {
  const { msg, person, img } = req.body;
  // console.log(req.body.msg);
  if (!msg || !person || !img) {
    return res.json({ data: "Please fill all the fields", status: 422 });
  }
  const id = uuid.v4();
  const created = new Date().toISOString();
  try {
    const notification = {
      pk: UserName,
      sk: `notifications#${id}`,
      id,
      ...req.body,
      created,
    };
    const data = await db.put(notification, TableName);
    // console.log(song);
    res.json({ data: data, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/batchAdd", isAuthenticated, async (req, res) => {
  const data = req.body;

  const queries = [];
  data.forEach((notification) => {
    const id = uuid.v4();
    const created = new Date().toISOString();

    // const created = new Date().toISOString();
    const n = {
      pk: UserName,
      sk: `notifications#${id}`,
      id,
      ...notification,
      created,
    };
    queries.push(n);
  });
  try {
    queries.forEach(async (notification) => {
      await db.put(notification, TableName);
    });

    res.json({ data: queries, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

exports.router = router;
