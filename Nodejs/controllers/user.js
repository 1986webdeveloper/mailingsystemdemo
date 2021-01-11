const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

/**
 * get users data with out login user data
 * @param {*} req 
 * @param {*} res 
 */
exports.getUsers = (req, res) => {
    User.findAll({
      where: {
        id: {
          [Op.not]: req.userId,
        },
      }
    })
    .then(user => {
      res.status(200).send({
          status: true,
          data: user
      });
    })
    .catch(err => {
      res.status(500).send({ status: false, message: err.message });
    });
};