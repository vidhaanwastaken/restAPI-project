const db = require("../db/models");
const users = db.users;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const { uploadImage , generateSignedUrl} = require("../utils/s3_service");

// const usertype = require("../db/models/user/usertype");

const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES_IN,
});
};

const uploadProfileImage = async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image uploaded",
        });
    }

    const imageKey = await uploadImage(req.file);
    const result = await generateSignedUrl(imageKey);

   
    await db.users.update(
        { profileImage: imageKey },
        {
            where: {
                id: req.users.id,
            },
        }
    );

    res.status(200).json({
        success: true,
        profileImage: imageKey,
    });
};

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    console.log("body", body);

    let imageKey = null;

    if (req.file) {
        imageKey = await uploadImage(req.file);
    }

    if (!['1', '2'].includes(body.userType)) {
        throw new appError('invalid user type', 400);
    }

    const newUser = await users.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        profileImage: imageKey,
    });

    if (!newUser) {
        return next(new appError('failed to create the user', 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id,
    });

    return res.status(201).json({
        status: "success",
        data: result,
    });
});

const login = catchAsync(async (req,res,next)=>{
    const{email,password} = req.body;

    if(!email || !password){
        return next(new appError('please provide email and password', 400))

    }

    const result = await users.findOne({where:{email}});
    if(!result || !(await bcrypt.compare(password,result.password))){
    return next(new appError('incorrect email or password', 401))   
    }

    const token = generateToken({
        id: result.id,
    })

    return res.json({
        status: 'success',
        token,
    })
    
});

const authentication = catchAsync(async (req,res,next)=>{
//get token from header
let idToken = '';

if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    idToken = req.headers.authorization.split(' ')[1]
}
if(!idToken){
    return next(new appError('you are not logged in', 401))
}
//token verification
const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
// get user detail frmo db and add to req object
const freshUser = await users.findByPk(tokenDetail.id);
if(!freshUser){
    return next(new appError('user does not exist', 401))
}
req.users = freshUser;
return next();

})

const getProfileImage = catchAsync(async (req, res, next) => {

    
    const user = await users.findByPk(req.params.id);

    if (!user) {
        return next(new appError("User not found", 404));
    }

    const result = user.toJSON();

    delete result.password;

    if (result.profileImage) {
        result.profileImage = await generateSignedUrl(result.profileImage);
    }

    return res.status(200).json({
        status: "success",
        data: result.profileImage,
    });
});


const restrictTo = (...userTypes) => {
    const checkPermission = (req, res, next) => {
        if (!userTypes.includes(req.users.userType)) {
            return next(new appError('You do not have permission to perform this action', 403));
           
        }
     return next();    
    }
return checkPermission;}
module.exports = { signup,login, authentication, restrictTo ,getProfileImage, uploadProfileImage};

