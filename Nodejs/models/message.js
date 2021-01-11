'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        as: '_fromUserId',
        foreignKey: 'fromUserId',
        onDelete: 'CASCADE'
      })
      Message.belongsTo(models.User, {
        as: '_toUserId',
        foreignKey: 'toUserId',
        onDelete: 'CASCADE'
      })
    }
  };
  Message.init({
    fromUserId: DataTypes.NUMBER,
    toUserId: DataTypes.NUMBER,
    subject: DataTypes.STRING,
    isRead: DataTypes.NUMBER,
    message: DataTypes.STRING,
    messageId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};