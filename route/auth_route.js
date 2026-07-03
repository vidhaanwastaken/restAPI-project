const {
    signup,
    login,
    authentication,
    getProfileImage
} = require("../controller/authController");

const router = require("express").Router();

const upload = require("../utils/multer");
const uploadController = require("../controller/uploadController");

router.post("/signup", upload.single("profileImage"), signup);

router.post(
    "/upload",
    authentication,
    upload.single("file"),
    uploadController.uploadUserFile
);

router.get(
    "/me",
    authentication,
    uploadController.getUserData
);

router.post("/login", login);

router.get("/users/:id", authentication,);

module.exports = router;