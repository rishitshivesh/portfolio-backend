const Router = require("express").Router;
const router = Router();
const uuid = require("uuid");
// const db = require("../db/index").dbClient;
const db = require("../utils/Dynamo");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const TableName = process.env.TABLE_NAME;
const UserName = "ayush";
require("dotenv").config();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const blogs = await db.queryBeginsWith(UserName, "blogs", TableName);
    res.json({ data: blogs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
  //   res.send("Hello World! blogs are here");
});

router.get("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await db.get(UserName, `blogs#${id}`, TableName);
    res.json({ data: blog, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  const { title, date, author, body, raw } = req.body;
  // console.log(req.body.year);
  if (!title || !date || !author || !body || !raw) {
    return res.json({ data: "Please fill all the fields", status: 422 });
  }
  const id = uuid.v4();
  const created = new Date().toISOString();
  // const check_if_exists
  // const query =
  //   "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  try {
    const blog = {
      pk: UserName,
      sk: `blogs#${id}`,
      ...req.body,
      id,
      created,
    };
    const data = await db.put(blog, TableName);
    // console.log(blog);
    res.json({ data: data, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/batchAdd", isAuthenticated, async (req, res) => {
  const data = req.body;

  // // batch add blogs

  // const query =
  //   "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  // //   const params = [];
  const queries = [];
  data.forEach((blog) => {
    const id = uuid.v4();
    const created = new Date().toISOString();
    const s = {
      pk: UserName,
      sk: `blogs#${id}`,
      ...blog,
      id,
      created,
    };
    queries.push(s);
  });
  try {
    // const blogs = await db.batch(queries);
    queries.forEach(async (blog) => {
      await db.put(blog, TableName);
    });
    const blogs = queries;
    res.json({ data: blogs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});
exports.router = router;
