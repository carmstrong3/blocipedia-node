const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          title: "Winter Games",
          body: "Post your Winter Games stories.",
          private: "false",
          userId: this.user.id
      })
      .then((wiki) => {
        this.wiki = wiki; 
        done();
        })
      })
    }); 
  });

// Environment for guest user
  describe("GET /wikis", () => {
    // The /wikis page should render without errors
    it("should return a status code 200", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body).toContain("New Wiki");
        expect(body).toContain("Delete");
        expect(body).toContain("Winter Games");
        done();
      });
    });
  });
  // View for making a new wiki
  describe("GET /wikis/new", () => {
    // Should render form info for new wiki submission
    it("should show page title, prompts for input, and submission button", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();       // expect no errors
        expect(body).toContain("Create New Wiki"); //expect h1 element to render
        expect(body).toContain("Wiki title");  //expect form label for title to render
        expect(body).toContain("Body");  //expect form label for Body to render
        expect(body).toContain("Private?");  //expect form label for Private? to render
        done();
      });
    });  
  }); // end guest user context
});
