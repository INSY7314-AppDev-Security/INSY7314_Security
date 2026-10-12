const { body, param, query } = require('express-validator');
const { stripHtml } = require('../utils/sanitize');

// For create every field is required. For update every field is optional.
function field(name, isUpdate) {
  return isUpdate ? body(name).optional() : body(name);
}

function gigBodyRules(isUpdate) {
  return [
    field('title', isUpdate)
      .isString().withMessage('Title is required and must be text').bail()
      .customSanitizer(stripHtml)
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

    field('description', isUpdate)
      .isString().withMessage('Description is required and must be text').bail()
      .customSanitizer(stripHtml)
      .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

    field('price', isUpdate)
      .custom((value) => typeof value === 'number' || typeof value === 'string')
      .withMessage('Price is required and must be a number').bail()
      .isFloat({ min: 0.01, max: 1000000 }).withMessage('Price must be between R0.01 and R1,000,000')
      .bail()
      .custom((value) => /^\d+(\.\d{1,2})?$/.test(String(value)))
      .withMessage('Price can have at most 2 decimal places')
      .toFloat(),

    field('category', isUpdate)
      .isString().withMessage('Category is required and must be text').bail()
      .customSanitizer(stripHtml)
      .isLength({ min: 1, max: 50 }).withMessage('Category must be between 1 and 50 characters'),

    body('isAvailable')
      .optional()
      .custom((value) => typeof value === 'boolean')
      .withMessage('isAvailable must be true or false')
  ];
}

const gigIdRule = [
  param('id').isMongoId().withMessage('Invalid gig id')
];

const createGigRules = gigBodyRules(false);
const updateGigRules = [...gigIdRule, ...gigBodyRules(true)];

const browseGigRules = [
  query('category')
    .optional()
    .isString().withMessage('Category filter must be text').bail()
    .isLength({ max: 50 }).withMessage('Category filter is too long')
];

module.exports = { createGigRules, updateGigRules, gigIdRule, browseGigRules };