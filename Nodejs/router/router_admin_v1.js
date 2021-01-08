/*********************************************************************************************************** */
//                                  This is API Router for APP                                     //
/********************************************************************************************************* */

const validations = require('../validation/index');
const authController = require('./../controllers/auth');
const apiEndpint = "/api/v1";
const authMiddleware = require('./../middleware/authJwt');
const userController = require('./../controllers/user');
const messageController = require('./../controllers/message');

const { validate, ValidationError, Joi } = require('express-validation')



module.exports.set = (app) => {
    app.post(apiEndpint + '/register',validate(validations.signupValidation), authController.signup);
	app.post(apiEndpint + '/login', validate(validations.loginValidation), authController.signin);
    app.get(apiEndpint + '/users', authMiddleware.verifyToken, userController.getUsers);
    app.get(apiEndpint + '/inbox', authMiddleware.verifyToken, messageController.getInbox);
    app.get(apiEndpint + '/sent', authMiddleware.verifyToken, messageController.getSent);
    app.put(apiEndpint + '/updateInbox', authMiddleware.verifyToken, messageController.updateInbox);
    
    app.use(function(err, req, res, next) {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err)
        }
        
        return res.status(500).json(err)
    })
}

