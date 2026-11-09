const bcrypt = require('bcrypt');

// How many rounds of hashing (10 is a good secure default)
const SALT_ROUNDS = 10;

// A real bcrypt hash of a throwaway password. When a login uses an email that
// does not exist we still run a compare against this, so the response takes
// the same time as a real failed login (stops email guessing by timing).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

// Turn a plain password into a secure hash
async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
}

// Check if a plain password matches the stored hash
async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

module.exports = {
  DUMMY_HASH,
  hashPassword,
  comparePassword
};

//Plain English Breakdown for clarity
/*
bcrypt.hash scrambles the password so nobody can read it.
bcrypt.compare checks if the password the user types later matches the scrambled version.
We never store the real password. Only the scrambled version.
*/