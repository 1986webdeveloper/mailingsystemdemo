const { Message, User }= require("../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * get inbox data
 * @param {*} req 
 * @param {*} res 
 */
exports.getInbox = (req, res) => {
    Message.findAll({
        where: {
            toUserId:req.userId
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        include: [{
            model: User,
            as:'_fromUserId',
            attributes: ['id', 'fullName', 'email']
        }]
    })
    .then(data => {
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

/**
 * get sent box data
 * @param {*} req 
 * @param {*} res 
 */
exports.getSent = (req, res) => {
    Message.findAll(
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
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

/**
 * update inbox 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateInbox = (req, res) => {
    let data = {
        isRead: req.body.isRead
    }
    
    let query = {
        where: {id: req.body.messageId},
        returning: true, 
    }
    
    messageUpdate(data, query)
    .then(data => {
        res.status(200).send({
            status: true,
            message: "Inbox Updated successfully!",
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};

/**
 * compose message 
 * @param {*} req 
 * @param {*} res 
 */  
exports.composeMessage = (req, res) => {
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

/**
 * get sent message by message id
 * @param {*} req 
 * @param {*} res 
 */  
exports.getSentMessageById = (req, res) => {
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
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};
/**
 * update Message
 * @param {*} data 
 * @param {*} query 
 */
const messageUpdate = (data, query) => {
    return Message.update(data, query).then( (updatedMessage) => {
        return updatedMessage;
    })
};

/**
 * get inbox message by message id
 * @param {*} req 
 * @param {*} res 
 */    
exports.getInboxMessageById = (req, res) => {
    
    let data = {
        isRead: 1
    }
    
    let query = {
        where: {id: req.body.messageId},
        returning: true, 
    }
    // update message 
    messageUpdate(data, query)
    .then(data => {
        // find all data 
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
        res.status(500).send({ status: false, message: err.message });
    });
};

/**
 * get message by message id
 * @param {*} req 
 * @param {*} res 
 */   
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
        res.status(200).send({
            status: true,
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({ status: false, message: err.message });
    });
};