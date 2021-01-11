const Joi = require('joi');

const loginValidation = {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
}

const signupValidation = {
    body: Joi.object({
      fullName: Joi.string()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
}

const composeMessage = {
  body: Joi.object({
    fromUserId: Joi.number()
      .required(),
    toUserId: Joi.number()
      .required(),
    messageId: Joi.number()
      .required(),
    subject: Joi.string()
      .required(),
    message: Joi.string()
      .required(),
  }),
}

const getSentMessageById = {
  body: Joi.object({
    messageId: Joi.number()
      .required()
  }),
}

const getInboxMessageById = {
  body: Joi.object({
    messageId: Joi.number()
      .required()
  }),
}

const getMessageById = {
  body: Joi.object({
    messageId: Joi.number()
      .required()
  }),
}

module.exports = {
    loginValidation,
    signupValidation,
    composeMessage,
    getSentMessageById,
    getInboxMessageById,
    getMessageById
}; 
