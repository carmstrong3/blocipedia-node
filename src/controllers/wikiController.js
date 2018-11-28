const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next){
    wikiQueries.getAllWikis(req.user.id, (err, wikis) => {
      console.log(err);
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next){
  const authorized = new Authorizer(req.user).new();
    if(authorized) { 
      res.render("wikis/new");
  } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    } 
  },
  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized) { 
     wikiQueries.addWiki({
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      }, 
      (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    } 
  },
  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if(err || result == null){
        res.redirect(404, "/");
      } else {
      const authorized = new Authorizer(req.user, result["wiki"]).edit();
        if(authorized){
          res.render("wikis/edit", {result});
      } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/wikis/${req.params.id}`)
        } 
      }
    });
  },
  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err){
        res.redirect(err, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, "/wikis")
      }
    });
  },
  update(req, res, next){
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if(err || result == null){
        res.redirect(404, "/");
      } else {
        result["wiki"].body = markdown.toHTML(result["wiki"].body);
        res.render("wikis/show", {result});
      }
    });
  }
}


