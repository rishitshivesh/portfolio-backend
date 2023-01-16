const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

function Response(statusCode, message, data = null) {
  return { statusCode, message, data };
}

async function hash(value) {
  return await bcrypt.hash(value, 12);
}
async function authenticate(hashed) {
  return await bcrypt.compare(process.env.TOKEN, hashed);
}

async function verifyHash(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

exports.authenticate = authenticate;
exports.Response = Response;
exports.hash = hash;
exports.verifyHash = verifyHash;
