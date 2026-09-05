const { findUserByEmail, addUser } = require('../models/userStore');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

// ============================================
// REGISTER a new user
// ============================================
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if the email is already registered
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 2. Hash the password (never store plain text)
    const hashedPassword = await hashPassword(password);

    // 3. Create the new user object
    const newUser = {
      id: Date.now().toString(),   // simple unique ID for Part 1
      name,
      email,
      password: hashedPassword,    // store only the hashed version
      role: role || 'client'       // default role is client
    };

    // 4. Save the user
    addUser(newUser);

    // 5. Send success response (never send the password back)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    next(error);   // pass any error to the error handler
  }
}

// ============================================
// LOGIN an existing user
// ============================================
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 2. Check if the password is correct
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 3. Create a JWT token that contains id and role
    const token = generateToken(user);

    // 4. Send the token and user info back
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};

//Plain English Breakdown for clarity
/*
Register function:

Takes the name, email, password and role from the request.
Checks if that email is already used - if yes, returns error 409.
Hashes the password using the tool we created earlier.
Creates a new user object (with a simple ID).
Saves the user into our in-memory store.
Sends back a success message without the password.

Login function:

Takes email and password.
Looks for the user.
Compares the typed password with the stored hashed password.
If everything is correct, creates a JWT that contains the user’s id and role.
Sends the token back to the user.
*/