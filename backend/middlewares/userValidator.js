const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const createUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const updateUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateUserAvatarValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(validateURL),
  }),
});

module.exports = {
  createUserValidator,
  loginValidator,
  updateUserValidator,
  updateUserAvatarValidator,
};
