const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

/**
 * check duplicate email
 */

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          status: false,
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
};

const verify = {
  checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verify;
