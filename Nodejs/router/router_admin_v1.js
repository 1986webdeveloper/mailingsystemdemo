/*********************************************************************************************************** */
//                                  This is API Router for APP                                     //
/********************************************************************************************************* */

const validations = require('../validation/index');
const authController = require('./../controllers/auth');
const apiEndpint = "/api/v1";
const authMiddleware = require('./../middleware/authJwt');
const userController = require('./../controllers/user');

const { validate, ValidationError, Joi } = require('express-validation')



module.exports.set = (app) => {
    app.post(apiEndpint + '/register',validate(validations.signupValidation), authController.signup);
	app.post(apiEndpint + '/login', validate(validations.loginValidation), authController.signin);
    app.get(apiEndpint + '/users', authMiddleware.verifyToken, userController.getUsers);
    
    app.use(function(err, req, res, next) {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err)
        }
        
        return res.status(500).json(err)
    })
}

