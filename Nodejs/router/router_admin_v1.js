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
    app.post(apiEndpint + '/register', authController.signup);
	app.post(apiEndpint + '/login', validate(validations.login), authController.signin);
	app.post(apiEndpint + '/users', authMiddleware.verifyToken, userController.getUsers);
}
