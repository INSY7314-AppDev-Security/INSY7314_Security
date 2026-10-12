const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await hashPassword(password);

    // 3. Create and save the new user in MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client'    // default role is client
    });

    // 4. Send success response (never send the password back)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    // 11000 means MongoDB found a duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
    next(error);   // pass any other error to the error handler
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email (+password brings back the hidden hash)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
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
Checks MongoDB to see if that email is already used. If yes, returns error 409.
Hashes the password using the tool we created earlier.
Saves the new user in MongoDB.
Sends back a success message without the password.

Login function:

Takes email and password.
Looks for the user in MongoDB.
Compares the typed password with the stored hashed password.
If everything is correct, creates a JWT that contains the user's id and role.
Sends the token back to the user.
*/
