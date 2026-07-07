const db = require("../db/models");
const bcrypt = require("bcrypt");

const users = db.users;
const roles = db.roles;

const initializeRoles = async () => {
    const systemRoles = [
        {
            name: "SUPER_ADMIN",
            description: "Has complete access to the system.",
        },
        {
            name: "ADMIN",
            description: "Can manage users and projects.",
        },
        {
            name: "PROJECT_MANAGER",
            description: "Can manage assigned projects.",
        },
    ];

    
    for (const role of systemRoles) {
        const existingRole = await roles.findOne({
            where: { name: role.name },
        });

        if (!existingRole) {
            await roles.create(role);
            console.log(`Created role: ${role.name}`);
        }
    }

    
    const superAdminRole = await roles.findOne({
        where: {
            name: "SUPER_ADMIN",
        },
    });

    
    const existingSuperAdmin = await users.findOne({
        where: {
            roleId: superAdminRole.id,
        },
    });

    if (!existingSuperAdmin) {
        const hashedPassword = await bcrypt.hash(
            process.env.SUPER_ADMIN_PASSWORD,
            12
        );

        await users.create({
            firstName: process.env.SUPER_ADMIN_FIRST_NAME,
            lastName: process.env.SUPER_ADMIN_LAST_NAME,
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,

            roleId: superAdminRole.id,

            isActive: true,
            loginAttempts: 0,
            lockUntil: null,
        });

        console.log("Super Admin created successfully.");
    } else {
        console.log("Super Admin already exists.");
    }
};

module.exports = initializeRoles;