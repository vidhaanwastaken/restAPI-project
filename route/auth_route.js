
const { signup,login,authentication,getProfileImage,uploadProfileImage} = require('../controller/authController');
const router = require('express').Router();
const upload = require("../utils/multer");


router.post("/signup",upload.single("profileImage"),signup);
router.post("/profile-image",authentication,upload.single("profileImage"),uploadProfileImage);
router.post('/login', login)
router.get("/users/:id",authentication,getProfileImage);


module.exports = router;



