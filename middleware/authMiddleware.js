const { models } = require("mongoose");
const jwt = require('jsonwebtoken');

secretKey="vintique"

const tryCatch = (param) => async (req, res, next) => {
    try{
        await param(req, res);
    }
    catch(error){
        next(error);
    }
}

function verifierToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      req.token = bearerToken;
      jwt.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
          return res.sendStatus(403); 
        }
        
        req.custemerId = decoded.custemerId;
  
        next();
      });
    } else {
      res.sendStatus(403); 
    }
      
    } 
 
module.exports = verifierToken;

module.exports = tryCatch;