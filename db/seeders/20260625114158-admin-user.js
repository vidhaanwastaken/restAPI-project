const bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    const hashpassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('users', [
      {
        roleId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: process.env.ADMIN_EMAIL,
        password: hashpassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {userType: '0'}, {});
  },
};