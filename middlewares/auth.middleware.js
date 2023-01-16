const { authenticate, Response } = require("../utils/index.js");
async function isAuthenticated(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    const isAuth = await authenticate(token);
    if (!isAuth) {
      return res.status(401).json(Response(401, "Unauthorized"));
    }
    next();
  } catch (err) {
    return res.status(500).json(Response(500, "Internal Server Error"));
  }
}

exports.isAuthenticated = isAuthenticated;
