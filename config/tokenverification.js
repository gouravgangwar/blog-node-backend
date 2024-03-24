const key = require("../config/dbconfig");
const jsonwt = require("jsonwebtoken")

module.exports =  authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    //Extracting token from authorization header
    const token = authHeader.split(" ")[1];

    //Checking if the token is null
    if (!token) {
      return res.status(401).send("Authorization failed. No access token.");
    }
  
    //Verifying if the token is valid.
    jsonwt.verify(token, key.secret, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Could not verify token");
      }
      req.user = user;
    });
    next();
  };