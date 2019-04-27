'use strict';
module.exports = (sequelize, DataTypes) => {
  const VerificationToken = sequelize.define('VerificationToken', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING
  }, {});
  VerificationToken.associate = function (models) {
    // associations can be defined here
    VerificationToken.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: 'CASCADE'
      // foreignKeyConstraint: true
    });
  };
  return VerificationToken;
};