const { Message, User }= require("../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// get inbox data 
exports.getInbox = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    Message.findAll({
        where: {
            toUserId:req.userId
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
        include: [{
            model: User,
            as:'_fromUserId',
            attributes: ['id', 'fullName', 'email']
        }]
    })
    .then(data => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

// get sent box data 
exports.getSent = async (req, res) => {
    console.log("req 11==>", req.userId);
    // Save User to Database
    await Message.findAll(
        {
            where: {
                fromUserId:req.userId
            },
            order: [
                ['updatedAt', 'DESC'],
            ],
            include: [{
                model: User,
                as:'_toUserId',
                attributes: ['id', 'fullName', 'email']
            }]
        }
    )
    .then(data => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        console.log("err ==>", err)
        res.status(500).send({ status: false, message: err.message });
    });
};

// update inbox
exports.updateInbox = (req, res) => {
    console.log("req ==>", req.userId);
    // Save User to Database
    let data = {
        isRead: req.body.isRead
    }
    
    let query = {
        where: {id: req.body.messageId},
        returning: true, 
    }
    
    messageUpdate(data, query)
    .then(data => {
          console.log("user")
        res.status(200).send({
            status: true,
            message: "Inbox Updated successfully!",
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

// compose message  
exports.composeMessage = (req, res) => {
    console.log("req ==>", req.userId);
    console.log("req.body ==>", req.body);
    // Save User to Database
    let createMessage = {
        fromUserId: req.body.fromUserId,
        toUserId: req.body.toUserId,
        subject: req.body.subject,
        message: req.body.message,
        isRead: 0 ,
    }

    if(!!req.body.messageId) {
        createMessage.messageId = req.body.messageId
    }
    
    Message.create(createMessage)
        .then(data => {
          console.log("data", data)
        res.status(200).send({
            status: true,
            message: "Message send successfully!",
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

// get sent Message by id    
exports.getSentMessageById = (req, res) => {
    console.log("req ==>", req.userId);
    console.log("req.body ==>", req.body);
    // Save User to Database
    Message.findOne(
        {
            where: {
                id:req.body.messageId
            },
            include: [{
                model: User,
                as:'_toUserId',
                attributes: ['id', 'fullName', 'email']
            }]
        }
    )
    .then(data => {
          console.log("user")
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

const messageUpdate = (data, query) => {
    return Message.update(data, query).then( (updatedMessage) => {
        console.log("updatedMessage ==>", updatedMessage)
        return updatedMessage;
    })
};

// get Inbox Message by id    
exports.getInboxMessageById = (req, res) => {
    console.log("req ==>", req.userId);
    console.log("req.body ==>", req.body);
    // 
    let data = {
        isRead: 1
    }
    
    let query = {
        where: {id: req.body.messageId},
        returning: true, 
    }
    
    messageUpdate(data, query)
    .then(data => {
            console.log("data ==>", data)
        Message.findAll(
            {
                where: {
                    [Op.or]: [{id:req.body.messageId}, {messageId: req.body.messageId}]
                },
                order: [
                    ['messageId', 'ASC'],
                ],
                include: [{
                    model: User,
                    as:'_fromUserId',
                    attributes: ['id', 'fullName', 'email']
                },
                {
                    model: User,
                    as:'_toUserId',
                    attributes: ['id', 'fullName', 'email']
                }]
            }
        )
        .then(data => {
              console.log("user")
            
            res.status(200).send({
                status: true,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({ status: false, message: err.message });
        });
    })
    .catch(err => {
        console.log("err ==>", err);
        res.status(500).send({ status: false, message: err.message });
    });
};

// get Inbox Message by id    
exports.getMessageById = (req, res) => {
    Message.findOne(
        {
            where: {
                id:req.body.messageId
            },
            include: [{
                model: User,
                as:'_fromUserId',
                attributes: ['id', 'fullName', 'email']
            }]
        }
    )
    .then(data => {
          console.log("user")
        
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });

        
};