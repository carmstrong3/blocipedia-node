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
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here

    // User has many wikis with the foreign key being the userId
 };

  User.prototype.isAdmin = () => {
    return this.role === "admin";
  }

  User.prototype.isOwner = () => {
    console.log(this.id);
    return this.id === 1;
  }

  return User;
};
