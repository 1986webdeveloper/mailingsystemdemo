const db = require("../models");
const Message = db.message;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getInbox = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    Message.findAll()
        .then(res => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: res
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

exports.getSent = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    Message.findAll()
        .then(res => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: res
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

exports.updateInbox = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    Message.findAll()
        .then(res => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: res
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

exports.composeMessage = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    Message.findAll()
        .then(res => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: res
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};