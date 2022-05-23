const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token)
  if (!token) {
    return res.status(400).send("Serve effettuare il Login");
  }
  try {
    const decoded = jwt.verify(token, config.SUPER_SECRET);
    console.log(decoded)
    req.loggedUser = decoded;
  } catch (err) {
    console.log(err)
    return res.status(400).send("Token non valido");
  }
  return next();
};

module.exports = verifyToken;