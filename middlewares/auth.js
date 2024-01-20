const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {

     try {
          const token=req.headers.authorization.split(" ")[1]
          // Bearer @#O$W*&%($*&*) 
          // above is the format of req.headers.authorization and hence we split and take skip the 0th element
          if (!token) throw new Error('Access denied. Token not provided.');

          const user = await jwt.verify(token, process.env.jwt_secret_key);
          req.user = user;
          next();

     } catch (err) {
          res.status(403).json({ message: 'Invalid token.', error: err.message });
     }
};

module.exports = { authenticateToken };
