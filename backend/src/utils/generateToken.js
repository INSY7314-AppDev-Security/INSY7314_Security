const jwt = require('jsonwebtoken');

function generateToken(user) {
  // The data we put inside the token
  const payload = {
    id: user.id,
    role: user.role
  };

  // Create the token
  // It will expire after 1 day
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
}

module.exports = generateToken;

//Plain English Breakdown for clarity
/*
A JWT is like a temporary digital ID card.
We put the user’s id and role inside it.
The secret key (JWT_SECRET) makes sure nobody can fake the token.
After 1 day the token expires for safety.
*/