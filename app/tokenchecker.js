const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  console.log("CONTROLLO LOGIN")
  const token = req.cookies.token;
  if (!token) {
    console.log("Token assente")
    return res.status(400).send({message:"Serve effettuare il Login"});
  }
  try {
    const decoded = jwt.verify(token, config.SUPER_SECRET);
    console.log(decoded);
    req.loggedUser = decoded;
    
  } catch (err) {
    console.log("token errato")
    console.log(err)
    return res.status(400).send({message:"Token non valido"});
  }
  return next();
};

module.exports = verifyToken;