const db = require("../models");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getUsers = (req, res) => {
    // Save User to Database
    User.findAll()
      .then(user => {
          console.log("user")
        res.status(200).send(user);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };