const Joi = require('joi');
/**
 * login validation
 */
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

/**
 * signup validation
 */
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

/**
 * compose message validation
 */
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

/**
 * get sent message validation
 */
const getSentMessageById = {
  body: Joi.object({
    messageId: Joi.number()
      .required()
  }),
}

/**
 * get inbox validation
 */
const getInboxMessageById = {
  body: Joi.object({
    messageId: Joi.number()
      .required()
  }),
}

/**
 * get messageId validation
 */
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
