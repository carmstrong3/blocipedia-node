const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach((done) => {
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user
         done();
       })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
// Test the Create functionality
  describe("#create()", () => {
    it("should create a wiki object with a title, body, private and assigned user", (done) => {
      Wiki.create({
        title: "Expeditions to Alpha Centauri",
        body: "A compilation of reports from recent visits to the star system.",
        private: "false",
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Expeditions to Alpha Centauri");
        expect(wiki.body).toBe("A compilation of reports from recent visits to the star system.");
        expect(wiki.private).toBe(false);
        expect(wiki.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    // Failed parameters should not create object
    it("should not create a wiki with missing title, body, or assigned wiki", (done) => {
      Wiki.create({
        title: "Pros of Cryosleep during the long journey"
      })
      .then((wiki) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("notNull Violation: Wiki.body cannot be null")
        expect(err.message).toContain("notNull Violation: Wiki.private cannot be null")
        expect(err.message).toContain("notNull Violation: Wiki.userId cannot be null")
        done();
      })
    });
  });  //end create context

   // Use create functionality as before each for rest of tests
  describe("Create wiki before each test", () => {
    beforeEach((done) => {
      this.wiki;
        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          private: "false",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki; //store the user
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

    describe("#getWiki()", () => {
      it("should return the associated wiki", (done) => {
        Wiki.findByPk(
          this.wiki.id,
          {include: [{ model: User }]}
         )
        .then((associatedWiki) => {
          expect(associatedWiki.title).toBe("Expeditions to Alpha Centauri")
          done();
        });
      });
    });

    describe("#updateWiki()", () => {
      it("should return the associated wiki", (done) => {
        this.wiki.update(
          {title: "Why Hello There",
          body: "A compilation of reports from recent visits to the star system.",
          private: "false",
          userId: this.user.id
          }
        )
        .then((newWiki) => {
          expect(newWiki.title).toBe("Why Hello There");
          done();
        });
      });
    });

    describe("#deleteWiki()", () => {
      it("should return the associated wiki", (done) => {
        let secondWiki = this.wiki;
        secondWiki.destroy()
        .then((associatedWiki) => {
          expect(associatedWiki.title).toBeUndefined();
          done();
        });
      });
    });
  });
});

