const { celebrate, Joi } = require('celebrate');
const validator = require('validator');


const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.message('Invalid URL format');
  }
  return value;
};


const idValidator = (value, helpers) => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    return helpers.message('Invalid ID format');
  }
  return value;
};


const createItemValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(urlValidator).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().required().valid('hot', 'warm', 'cold').messages({
      "any.only": 'The "weather" field must be one of ["hot", "warm", "cold"]',
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});


const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(urlValidator).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});


const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});


const idValidation = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(idValidator).messages({
      "string.hex": 'The "id" field must be a valid hexadecimal string',
      "string.length": 'The "id" field must be 24 characters long',
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});


const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(urlValidator).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});


module.exports = {
  createItemValidation,
  createUserValidation,
  loginValidation,
  idValidation,
  updateUserValidation
};
