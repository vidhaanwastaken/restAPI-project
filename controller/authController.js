const db = require("../db/models");
const users = db.users;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')

const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES_IN,
});
};

const signup = catchAsync(async (req, res, next)=>{
    const body = req.body;
    console.log("body", body);

    if(!['1','2'].includes(body.userType)){
        throw new appError('invalid user type', 400)
    }

    const newUser = await users.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
    })
    if(!newUser){
        return next(new appError('failed to create the user', 400))
    }

    const result = newUser.toJSON()


    delete result.password
    delete result.deleteAt
    

    result.token = generateToken({
        id: result.id
    })
    
    
    return res.status(201).json({
        status: 'success',
        data: result,
    })
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
    
})
module.exports = { signup,login }