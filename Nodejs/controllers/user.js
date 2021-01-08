const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.getUsers = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    User.findAll({
      where: {
        id: {
          [Op.not]: req.userId,
        },
      }
    })
      .then(user => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: user
        });
      })
      .catch(err => {
        res.status(500).send({ status: false, message: err.message });
      });
  };