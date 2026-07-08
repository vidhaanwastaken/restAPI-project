const appError = require("../utils/appError");

const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.users || !req.users.role) {
            return next(
                new appError("Access denied. No role assigned.", 403)
            );
        }

        if (!allowedRoles.includes(req.users.role.role)) {
            return next(
                new appError(
                    "You do not have permission to perform this action.",
                    403
                )
            );
        }

        next();
    };
};

module.exports = authorize;