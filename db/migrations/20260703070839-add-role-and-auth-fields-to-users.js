"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Remove old role system
        await queryInterface.removeColumn("users", "userType");

        // Add new role reference
        await queryInterface.addColumn("users", "roleId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });

        // User active/inactive
        await queryInterface.addColumn("users", "isActive", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        // Failed login attempts
        await queryInterface.addColumn("users", "loginAttempts", {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        // Account lock timestamp
        await queryInterface.addColumn("users", "lockUntil", {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("users", "roleId");
        await queryInterface.removeColumn("users", "isActive");
        await queryInterface.removeColumn("users", "loginAttempts");
        await queryInterface.removeColumn("users", "lockUntil");

        // Restore old column if rolling back
        await queryInterface.addColumn("users", "userType", {
            type: Sequelize.ENUM("0", "1", "2"),
            allowNull: false,
        });
    },
};