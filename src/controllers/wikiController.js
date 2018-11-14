const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");

module.exports = {
  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
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
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
      const authorized = new Authorizer(req.user, wiki).edit();
        if(authorized){ 
          res.render("wikis/edit", {wiki});
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
        console.log(err);
        res.redirect(err, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, "/wikis")
      }
    });
  },
  deleteWiki(req, callback){
    return Wiki.findByPk(req.params.id)
     .then((wiki) => {
     const authorized = new Authorizer(req.user, wiki).destroy();

       if(authorized) {
         wiki.destroy()
         .then((res) => {
           callback(null, wiki);
         });
       } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      } 
    })
    .catch((err) => {
      callback(err);
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
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", {wiki});
      }
    });
  }
}



















