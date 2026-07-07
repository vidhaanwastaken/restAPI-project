const db = require("../db/models");
const { fn, col, where } = require("sequelize");

const roles = db.roles;

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const createRole = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    // Validate role name
    if (!name || !name.trim()) {
        return next(new appError("Role name is required.", 400));
    }

    const roleName = name.trim();

    // Prevent creation of Super Admin role
    if (roleName.toLowerCase() === "super admin") {
        return next(
            new appError(
                "Super Admin role cannot be created through this API.",
                403
            )
        );
    }

    // Check if role already exists (case-insensitive)
    const existingRole = await roles.findOne({
        where: where(
            fn("LOWER", col("name")),
            roleName.toLowerCase()
        ),
    });

    if (existingRole) {
        return next(new appError("Role already exists.", 409));
    }

    // Create role
    const newRole = await roles.create({
        name: roleName,
        description: description?.trim() || null,
    });

    return res.status(201).json({
        status: "success",
        message: "Role created successfully.",
        data: newRole,
    });
});

module.exports = {
    createRole,
};