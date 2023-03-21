const jwt = require('jsonwebtoken');

// Token secret and expiration time are set here  (can be changed to environment variables)
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware function to check if the user is logged in or not (if the token is valid)
  authMiddleware: function ({ req }) {

  // Allows token to be sent via req.query or headers (if it exists)
  // Token is sent in the request header
    let token = req.query.token || req.headers.authorization || req.body.token;

    // Header is split and token is extracted from it (if it exists)
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // Token is verified
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      // If token is invalid, an error message is returned
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

  // Request is returned with the user's data attached to it (if the token is valid) 
    return req;
  },

  // Function to sign a token and return it to the client (user) when they log in or sign up
  // (this is the token that will be sent in the request header)
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Token is signed and returned to the client (user) when they log in or sign up (this is the token that will be sent in the request header) 

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

// Path: server\utils\index.js