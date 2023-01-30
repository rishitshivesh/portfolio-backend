const Router = require("express").Router;
const router = Router();
const uuid = require("uuid");
// const db = require("../db/index").dbClient;
const { isAuthenticated } = require("../middlewares/auth.middleware");
router.get("/", isAuthenticated, async (req, res) => {
  const query = "SELECT * FROM cassandra.notifications";
  try {
    const songs = await db.execute(query, [], { prepare: true });
    res.json({ data: songs.rows, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
  //   res.send("Hello World! Songs are here");
});

router.post("/", isAuthenticated, async (req, res) => {
  const { msg, person, img } = req.body;
  console.log(req.body.msg);
  const id = uuid.v4();
  const created = new Date().toISOString();
  const query =
    "INSERT INTO cassandra.notifications (id, msg, person, img, created) VALUES (?, ?, ?, ?, ?)";
  try {
    const notification = await db.execute(query, [
      id,
      msg,
      person,
      img,
      created,
    ]);
    console.log(song);
    res.json({ data: notification, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/batchAdd", isAuthenticated, async (req, res) => {
  const data = req.body;

  // batch add notifications

  const query =
    "INSERT INTO cassandra.notifications (id, msg, person, img) VALUES (?, ?, ?, ?)";

  const queries = [];
  data.forEach((notification) => {
    const id = uuid.v4();
    // const created = new Date().toISOString();
    const params = [
      id,
      notification.msg,
      notification.person,
      notification.img,
      //   created,
    ];
    queries.push({ query, params });
  });
  try {
    const notifications = await db.batch(queries, { prepare: true });
    res.json({ data: notifications, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

exports.router = router;
