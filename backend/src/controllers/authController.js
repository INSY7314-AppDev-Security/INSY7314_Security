const User = require('../models/User');
const { hashPassword, comparePassword, DUMMY_HASH } = require('../utils/hashPassword');
const {
  isLocked,
  lockExpired,
  minutesLeft,
  shouldLock,
  lockUntilDate
} = require('../utils/lockout');
const { logSecurityEvent } = require('../utils/securityEvents');
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

    // 1. Find the user by email (+ brings back fields that are hidden by default)
    const user = await User.findOne({ email }).select('+password +failedLoginAttempts +lockUntil');

    // Unknown email: do a fake password check so the response takes as long as
    // a real failure, then give the same generic answer.
    if (!user) {
      await comparePassword(password, DUMMY_HASH);
      logSecurityEvent('LOGIN_FAILED', { email, ip: req.ip, reason: 'unknown_email' });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 2. A lock that has run out is cleared, so the user gets a fresh start
    if (lockExpired(user)) {
      await User.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
    }

    // 3. Still locked: refuse WITHOUT checking the password, so even the
    //    correct password cannot be used to guess its way in during the lock.
    if (isLocked(user)) {
      logSecurityEvent('LOGIN_BLOCKED_LOCKED', { userId: String(user._id), email, ip: req.ip });
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked after too many failed attempts. Try again in ${minutesLeft(user)} minute(s).`
      });
    }

    // 4. Wrong password: count it, and lock the account when the limit is reached.
    //    $inc is atomic, so two requests at the same moment cannot undercount.
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      const updated = await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { failedLoginAttempts: 1 } },
        { new: true }
      ).select('+failedLoginAttempts');

      if (updated && shouldLock(updated.failedLoginAttempts)) {
        await User.updateOne({ _id: user._id }, { $set: { lockUntil: lockUntilDate() } });
        logSecurityEvent('ACCOUNT_LOCKED', {
          userId: String(user._id),
          email,
          ip: req.ip,
          failedAttempts: updated.failedLoginAttempts
        });
      } else {
        logSecurityEvent('LOGIN_FAILED', {
          userId: String(user._id),
          email,
          ip: req.ip,
          reason: 'wrong_password',
          failedAttempts: updated ? updated.failedLoginAttempts : undefined
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 5. Success: clear any earlier failures
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await User.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });
    }

    const token = generateToken(user);
    logSecurityEvent('LOGIN_SUCCESS', { userId: String(user._id), email, ip: req.ip });

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
