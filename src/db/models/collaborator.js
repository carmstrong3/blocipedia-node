'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
  };
  // add scope for user view of collaborators
  Collaborator.addScope("userCollaborationsFor", (userId) => {
    return {
      where: {
        userId: userId
      },
      order: [ 
        ["createdAt", "ASC"] 
      ]
    }
  });
  // add scope for wiki view of collaborators
  Collaborator.addScope("wikiCollaborationsFor", (wikiId) => {
    return {
      where: {
        wikiId: wikiId
      },
      order: [ 
        ["createdAt", "ASC"] 
      ]
    }
  });

    

  return Collaborator;
};
