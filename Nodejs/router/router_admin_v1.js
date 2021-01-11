/*********************************************************************************************************** */
//                                  This is API Router for APP                                     //
/********************************************************************************************************* */

const validations = require('../validation/index');
const verify = require('./../middleware/verify')
const authController = require('./../controllers/auth');
const apiEndpint = "/api/v1";
const authMiddleware = require('./../middleware/authJwt');
const userController = require('./../controllers/user');
const messageController = require('./../controllers/message');

const { validate, ValidationError } = require('express-validation')



module.exports.set = (app) => {
    app.post(apiEndpint + '/register',validate(validations.signupValidation), verify.checkDuplicateEmail, authController.signup);
	app.post(apiEndpint + '/login', validate(validations.loginValidation), authController.signin);
    app.get(apiEndpint + '/users', authMiddleware.verifyToken, userController.getUsers);
    app.get(apiEndpint + '/inbox', authMiddleware.verifyToken, messageController.getInbox);
    app.get(apiEndpint + '/sent', authMiddleware.verifyToken, messageController.getSent);
    app.put(apiEndpint + '/updateInbox', authMiddleware.verifyToken, messageController.updateInbox);
    app.post(apiEndpint + '/composeMessage', authMiddleware.verifyToken, validate(validations.composeMessage), messageController.composeMessage);
    app.post(apiEndpint + '/getSentMessageById', authMiddleware.verifyToken, validate(validations.getSentMessageById), messageController.getSentMessageById);
    app.post(apiEndpint + '/getInboxMessageById', authMiddleware.verifyToken, validate(validations.getInboxMessageById), messageController.getInboxMessageById);
    app.post(apiEndpint + '/getMessageById', authMiddleware.verifyToken, validate(validations.getMessageById), messageController.getMessageById);
    
    app.use(function(err, req, res, next) {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err)
        }
        return res.status(500).json(err)
    })
}

