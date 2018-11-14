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
        expect(body).toContain("Winter Games");
        done();
      });
    });
  });
  // View for making a new wiki
  describe("GET /wikis/new", () => {
    // Should render form info for new wiki submission
    it("should redirect to wikis list", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();       // expect no errors
        expect(body).toContain("Wiki"); //expect h1 element to render
        done();
      });
    });  
  }); // end guest user context

  // Environment for member user
  describe("Member User", () => {
    // Authenticate new user 
    beforeEach((done) => {
      User.create({
        email: "member@example.com",
        password: "123456",
        role: "member"
      })
      .then((user) => {
        request.get({         // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,     // mock authenticate as a member user
            userId: user.id,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });
    });
    // Wikis main page
    describe("GET /wikis", () => {
      // Should not be able to edit previously made wikis that member is not owner of
      it("should render the wikis page without giving options to edit or delete wikis while still giving ability to create new wiki.", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wiki")  // New Wiki button should show
          expect(body).not.toContain("Edit");  // Edit button should not show
          expect(body).not.toContain("Delete"); // Delete button should not show
          done();
        });
      });
    });
  });    
});
