const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {
  new(req, res, next){
    res.render("collaborators/new", {wikiId: req.params.wikiId});
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
     collaboratorQueries.addCollaborator({
        userId: req.body.userId,
        wikiId: req.params.wikiId
      }, 
      (err, collaborator) => {
        if(err){
          res.redirect(500, "/wikis");
        } else {
          res.redirect(303, `/wikis/${collaborator.wikiId}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    } 
  },
  destroy(req, res, next){
    collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
      if(err){
        res.redirect(err, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, `/wikis/${collaborator.wikiId}`)
      }
    });
  }
}



