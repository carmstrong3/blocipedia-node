'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here

    // User has many wikis with the foreign key being the userId
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
  };

  User.prototype.isAdmin = () => {
    return this.role === "admin";
  }

  return User;
};
