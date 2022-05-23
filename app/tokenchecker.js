const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(400).send("Serve effettuare il Login");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.loggedUser = decoded;
  } catch (err) {
    return res.status(400).send("Token non valido");
  }
  return next();
};

module.exports = verifyToken;