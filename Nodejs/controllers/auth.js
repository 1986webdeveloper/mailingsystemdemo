const db = require("../models");
const config = require("../config");
const User = db.user;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
        console.log("user", user);
        res.status(200).send({
            status: true,
            message: "User registered successfully!",
            data: user
          });
    })
    .catch(err => {
      res.status(500).send({ status: false, message: err.message });
    });
};

exports.signin = (req, res) => {

  console.log("req ==>", req.body);
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ status: false, message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: 86400 // 24 hours
      });


      res.status(200).send({
        status: true,
        message: "User login successfully!",
        data: user,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ status: false, message: err.message });
    });
};
