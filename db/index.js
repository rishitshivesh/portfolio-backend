const cassandra = require("cassandra-driver");
require("dotenv").config();
const dbClient = new cassandra.Client({
  cloud: {
    secureConnectBundle: `${__dirname}/secure-connect-portfolio-db.zip`,
  },
  keyspace: "cassandra",
  credentials: {
    username: process.env.CASSANDRA_USERNAME,
    password: process.env.CASSANDRA_PASSWORD,
  },
});

async function connectDB() {
  try {
    await dbClient.connect();
    console.log("Connected to Cassandra");

    // const songsQuery =
    //   "create table if not exists cassandra.songs (id uuid, title text, artist text, album text, year int, src text, albumart text, created text, primary key(id))";
    const blogsQuery =
      "create table if not exists cassandra.blogs (id uuid, title text, body text, author text, primary key(id))";
    const musicQuery =
      "create table if not exists cassandra.music (id uuid, name text, artist text, art text, album text, year text, src text, album_art text, created text, primary key(id))";
    const notificationsQuery =
      "create table if not exists cassandra.notifications (id uuid, msg text, person text, img text, primary key(id))";
    await dbClient.execute(musicQuery, []);
    await dbClient.execute(blogsQuery, []);
    await dbClient.execute(notificationsQuery, []);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { dbClient, connectDB };
