const Router = require("express").Router;
const router = Router();
const uuid = require("uuid");
const db = require("../db/index").dbClient;
const { isAuthenticated } = require("../middlewares/auth.middleware");
router.get("/", isAuthenticated, async (req, res) => {
  const query = "SELECT * FROM cassandra.music";
  try {
    const songs = await db.execute(query, [], { prepare: true });
    res.json({ data: songs.rows, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
  //   res.send("Hello World! Songs are here");
});

router.post("/", isAuthenticated, async (req, res) => {
  const { name, artist, album, year, src, album_art, art } = req.body;
  console.log(req.body.year);
  const id = uuid.v4();
  const created = new Date().toISOString();
  const query =
    "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  try {
    const song = await db.execute(query, [
      id,
      name,
      artist,
      album,
      year,
      src,
      album_art,
      art,
      created,
    ]);
    console.log(song);
    res.json({ data: song, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});

router.post("/batchAdd", isAuthenticated, async (req, res) => {
  const data = req.body;

  // batch add songs

  const query =
    "INSERT INTO cassandra.music (id, name, artist, album, year, src, album_art, art, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
  //   const params = [];
  const queries = [];
  data.forEach((song) => {
    const id = uuid.v4();
    const created = new Date().toISOString();
    const params = [
      id,
      song.name,
      song.artist,
      song.album,
      song.year,
      song.src,
      song.album_art,
      song.art,
      created,
    ];
    queries.push({ query, params });
  });
  try {
    const songs = await db.batch(queries);
    res.json({ data: songs, status: 200 });
  } catch (err) {
    res.json({ data: err, status: 500 });
  }
});
exports.router = router;
