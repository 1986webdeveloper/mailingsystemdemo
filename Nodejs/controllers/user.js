const db = require("../models");
const User = db.user;

exports.getUsers = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    User.findAll()
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