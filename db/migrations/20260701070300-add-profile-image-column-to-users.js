// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.addColumn("user", "profileImage", {
//       type: Sequelize.STRING,
//       allowNull: true,
//     })
//   },

//   async down (queryInterface, Sequelize) {
//    await queryInterface.removeColumn("Users", "profileImage");
//   }
// };

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profileImage", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "profileImage");
  },
};
