'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body:{
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    // Wiki belongs to User model where the userId is a foreign key.
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });    
  };

  // Define the scope by calling addScope on the model.
  Wiki.addScope("lastFiveFor", (userId) => {
    return {
  // Return the implemented query
      where: {userId: userId},
  // Set a limit which establishes the maximum number of records the query will return. Order by newest first by the "createdAt" property of the post.
      limit: 5,     
      order: [["createdAt", "DESC"]]
    }
  });
  return Wiki;
};
