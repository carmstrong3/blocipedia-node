'use strict';
// load faker. faker info at https://github.com/marak/Faker.js/ 
const faker = require("faker");
// initialize users
let users = [];
// push values to users
for(let i = 0; i <= 10; i++){
// info needs to match user model.
  users.push({
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', users, {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
