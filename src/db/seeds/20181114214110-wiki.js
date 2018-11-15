'use strict';
// load faker. faker info at https://github.com/marak/Faker.js/ 
const faker = require("faker");
// initialize wikis
let wikis = [];
// initialize userId function
const generateUserId = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
// push values to wikis
for(let i = 0; i <= 15; i++){
// info needs to match wiki model.
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.lorem.sentence(),
    private: false,
    userId: generateUserId(1, 10), 
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

    return queryInterface.bulkInsert('Wikis', wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Wikis', null, {});
  }
};
