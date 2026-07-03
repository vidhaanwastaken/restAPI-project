"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        // await queryInterface.addColumn("users", "profileImage", {
        //     type: Sequelize.STRING,
        //     allowNull: true,
        // });

        await queryInterface.addColumn("users", "panCard", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("users", "audioFile", {
            type: Sequelize.STRING,
            allowNull: true,
        });

    },

    async down(queryInterface, Sequelize) {

        // await queryInterface.removeColumn("users", "profileImage");

        await queryInterface.removeColumn("users", "panCard");

        await queryInterface.removeColumn("users", "audioFile");

    }
}