const jwt = require('jsonwebtoken');

function generateToken(user) {
  // The data we put inside the token.
  // tv (token version) lets the server cancel old tokens: if the user logs out,
  // the number stored on the user goes up and every older token stops working.
  const payload = {
    id: user._id,
    role: user.role,
    tv: user.tokenVersion || 0
  };

  // Short-lived by default (2 hours). Can be changed with JWT_EXPIRES_IN.
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

  return token;
}

module.exports = generateToken;

//Plain English Breakdown for clarity
/*
A JWT is like a temporary digital ID card.
We put the user's id, role and a "version" number inside it.
The secret key (JWT_SECRET) makes sure nobody can fake the token.
The card expires after 2 hours, and it is also cancelled early if the
user logs out (the version number on the user no longer matches).
*/
