// const db = require("../db/models");
// const users = db.users;
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const roles = db.roles;
// const catchAsync = require('../utils/catchAsync')
// const appError = require('../utils/appError')
// const { uploadFile , generateSignedUrl} = require("../utils/s3_service");


// const generateToken = (payload)=>{
//     return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
//     expiresIn: process.env.JWT_EXPIRES_IN,
// });
// };


// const signup = catchAsync(async (req, res, next) => {
//     const body = req.body;

//     console.log("body", body);

//     let imageKey = null;

//     if (req.file) {
//         imageKey = await uploadImage(req.file);
//     }

    

//     const newUser = await users.create({
        
//         firstName: body.firstName,
//         lastName: body.lastName,
//         email: body.email,
//         password: body.password,
//         confirmPassword: body.confirmPassword,
//         profileImage: imageKey,
//     });

//     if (!newUser) {
//         return next(new appError('failed to create the user', 400));
//     }

//     const result = newUser.toJSON();

//     delete result.password;
//     delete result.deletedAt;

//     result.token = generateToken({
//         id: result.id,
//     });

//     return res.status(201).json({
//         status: "success",
//         data: result,
//     });
// });

// const login = catchAsync(async (req,res,next)=>{
//     const{email,password} = req.body;

//     if(!email || !password){
//         return next(new appError('please provide email and password', 400))

//     }

//     const result = await users.findOne({where:{email}});
//     if(!result || !(await bcrypt.compare(password,result.password))){
//     return next(new appError('incorrect email or password', 401))   
//     }

//     const token = generateToken({
//         id: result.id,
//     })

//     return res.json({
//         status: 'success',
//         token,
//     })
    
// });

// const authentication = catchAsync(async (req,res,next)=>{
// //get token from header
// let idToken = '';

// if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//     idToken = req.headers.authorization.split(' ')[1]
// }
// if(!idToken){
//     return next(new appError('you are not logged in', 401))
// }
// //token verification
// const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
// // get user detail frmo db and add to req object
// const freshUser = await users.findByPk(tokenDetail.id);
// if(!freshUser){
//     return next(new appError('user does not exist', 401))
// }
// req.users = freshUser;
// console.log("Authentication Middleware:", req.users);
// return next();

// })


// const restrictTo = (...userTypes) => {

//     const checkPermission = (req, res, next) => {
//         if (!userTypes.includes(req.users.userType)) {
//             return next(new appError('You do not have permission to perform this action', 403));
           
//         }
//      return next();    
//     }

//     return checkPermission;}
// module.exports = { signup,login, authentication, restrictTo};



const db = require("../db/models");
const users = db.users;
const roles = db.roles;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const { uploadImage } = require("../utils/s3_service");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    let imageKey = null;

    if (req.file) {
        imageKey = await uploadImage(req.file);
    }

    const newUser = await users.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,

        profileImage: imageKey,

        
        roleId: null,

        isActive: true,
        loginAttempts: 0,
        lockUntil: null,
    });

    if (!newUser) {
        return next(new appError("Failed to create user", 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    return res.status(201).json({
        status: "success",
        message:
            "Registration successful. Please wait for the Super Admin to assign you a role before logging in.",
        data: result,
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new appError("Please provide email and password.", 400)
        );
    }

    const result = await users.findOne({
        where: { email },
        include: [
            {
                model: roles,
                as: "role",
            },
        ],
    });
    console.log(result?.toJSON());
    if (!result) {
        return next(new appError("Incorrect email or password.", 401));
    }

    if (!result.isActive) {
        return next(new appError("Your account has been disabled.", 403));
    }

    if (!result.roleId) {
        return next(
            new appError(
                "Your account is awaiting role assignment by the Super Admin.",
                403
            )
        );
    }

    if (!result.role.isActive) {
        return next(
            new appError(
                "Your role has been disabled. Please contact the administrator.",
                403
            )
        );
    }

    const correctPassword = await bcrypt.compare(
        password,
        result.password
    );

    if (!correctPassword) {
        return next(new appError("Incorrect email or password.", 401));
    }

    const token = generateToken({
        id: result.id,
    });

    return res.status(200).json({
        status: "success",
        token,
    });
});

const authentication = catchAsync(async (req, res, next) => {
    let idToken = "";

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        idToken = req.headers.authorization.split(" ")[1];
    }

    if (!idToken) {
        return next(new appError("You are not logged in.", 401));
    }

    const tokenDetail = jwt.verify(
        idToken,
        process.env.JWT_SECRET_KEY
    );

    const freshUser = await users.findByPk(tokenDetail.id, {
        include: [
            {
                model: roles,
                as: "role",
            },
        ],
    });

    if (!freshUser) {
        return next(new appError("User no longer exists.", 401));
    }

    if (!freshUser.isActive) {
        return next(new appError("User account is disabled.", 403));
    }

    req.users = freshUser;

    next();
});

const restrictTo = (...allowedRoles) => {
    
    return (req, res, next) => {
       
        if (!req.users.role) {
            return next(new appError("No role assigned.", 403));
        }

        if (!allowedRoles.includes(req.users.role.name)) {
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

module.exports = {
    signup,
    login,
    authentication,
    restrictTo,
};