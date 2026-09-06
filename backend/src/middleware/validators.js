const { body, validationResult } = require('express-validator');

//VALIDATION RULES – REGISTER
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),

  body('role')
    .optional()
    .isIn(['client', 'freelancer']).withMessage('Role must be either "client" or "freelancer"')
];

//VALIDATION RULES – LOGIN
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

//MIDDLEWARE – CHECK VALIDATION RESULTS
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
}

module.exports = {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
};

//Plain English Breakdown for clarity
/*
registerValidationRules checks that name, email, password and role all look correct
before database database is touched or anything is hashed, saving wasted work and
stops bad data getting in.

loginValidationRules only checks that email and password were sent, we don't check
password strength on login because we're just checking it against what's already stored.

handleValidationErrors runs after the rules above. If express-validator found any
problems, it stops the request right there with a clean 400 response listing every
field that failed. If everything is fine, it calls next() and lets the request
continue to the controller.
*/