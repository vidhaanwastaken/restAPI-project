const express = require("express");

const roleController = require("../controller/roleController");
const authController = require("../controller/authController");

const router = express.Router();

router.post(
    "/",
    authController.authentication,
    authController.restrictTo("SUPER_ADMIN"),
    roleController.createRole
);

module.exports = router;