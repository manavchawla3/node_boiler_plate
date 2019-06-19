'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    verifyEmailToken: DataTypes.STRING,
    verifyEmailExpires: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {
    tableName: 'users',
    modelName: 'User',
  });

  return User;
};
