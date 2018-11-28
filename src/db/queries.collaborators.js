const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {

  addCollaborator(newCollaborator, callback){
    return Collaborator.create(newCollaborator)
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getCollaborationsByUserId(userId, callback){
    let result = {} ;
    return Collaborator.findByPk(userId, {
      include: [{ model: User }]
    })
    .then((collaborator) => {
      result["collaborator"] = collaborator;
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    }); 
  },
  getCollaboratorsByWikiId(wikiId, callback){
    let result = {} ;
    return Collaborator.findByPk(wikiId, {
      include: [{ model: Wiki }]
    })
    .then((collaborator) => {
      result["collaborator"] = collaborator;
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    }); 
  },
  deleteCollaborator(req, callback){
    return Collaborator.findByPk(req.params.id)
    .then((collaborator) => {
      const authorized = new Authorizer(req.user, collaborator).destroy();
      if(authorized) { 
        collaborator.destroy()
        .then((res) => {
          callback(null, collaborator);
        });
        
    } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      } 
    })
    .catch((err) => {
      callback(err);
    });
  }
}
