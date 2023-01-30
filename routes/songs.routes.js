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
    const songs = await db.queryBeginsWith(UserName, "songs", TableName);
    res.json({ data: songs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
  //   res.send("Hello World! Songs are here");
});

router.post("/", isAuthenticated, async (req, res) => {
  const { name, artist, album, year, src, album_art, art } = req.body;
  // console.log(req.body.year);
  if (!name || !artist || !album || !year || !src || !album_art || !art) {
    return res.json({ data: "Please fill all the fields", status: 422 });
  }
  const id = uuid.v4();
  const created = new Date().toISOString();
  // const check_if_exists
  // const query =
  //   "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  try {
    const song = {
      pk: UserName,
      sk: `songs#${id}`,
      id,
      ...req.body,
      created,
    };
    const data = await db.put(song, TableName);
    // console.log(song);
    res.json({ data: data, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/batchAdd", isAuthenticated, async (req, res) => {
  const data = req.body;

  // // batch add songs

  // const query =
  //   "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  // //   const params = [];
  const queries = [];
  data.forEach((song) => {
    const id = uuid.v4();
    const created = new Date().toISOString();
    const s = {
      pk: UserName,
      sk: `songs#${id}`,
      id,
      ...song,
      created,
    };
    queries.push(s);
  });
  try {
    // const songs = await db.batch(queries);
    queries.forEach(async (song) => {
      await db.put(song, TableName);
    });
    const songs = queries;
    res.json({ data: songs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});
exports.router = router;
