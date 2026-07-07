"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("roles", [
            {
                name: "SUPER_ADMIN",
                description: "Has complete access to the system.",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "ADMIN",
                description: "Can manage users, roles, and projects.",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "PROJECT_MANAGER",
                description: "Can create and manage their own projects.",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("roles", {
            name: [
                "SUPER_ADMIN",
                "ADMIN",
                "PROJECT_MANAGER",
            ],
        });
    },
};