const Joi = require('joi');

const registerValidation = {
    body: Joi.object({
      fullName: Joi.string()
        .email()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  }

module.exports = {
    registerValidation: registerValidation,
}; 