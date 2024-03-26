const jwt = require('jsonwebtoken');
secretKey="vintique"
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

    
    /*
  function  autoriserUsers(role){
      return (req, res, next) => {
        if (req.userRole === role || req.userRole === 'user') {
          next();
        } else {
          res.status(403).json({ message: 'Insufficient permissions' });
        }
      };


    }
  */
  
 
  
  
module.exports = verifierToken;
  
  