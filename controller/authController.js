const db = require("../db/models");
const user = db.users; 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES_IN,
});
};

const signup = async (req, res, next)=>{
    const body = req.body;

    if(!['1','2'].includes(body.userType)){
        return res.status(400).json({
            status: "fail",
            message: 'invalid user type'
        })
    }

    const newUser = await users.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    })

    const result = newUser.toJSON()

    delete result.password
    delete result.deleteAt

    result.token = generateToken({
        id: result.id
    })

    if(!result){
        return res.status(400).json({
            status: "fail",
            message: 'failed to create the user'
        })
    }
    return res.status(201).json({
        status: 'success',
        data: result,
    })
};

const login = async (req,res,next)=>{
    const{email,password} = req.body;

    if(!email || !password){
        return res.status(401).json({
            status: 'fail',
            message: 'please provide email and password'
        })
    }

    const result = await users.findOne({where:{email}});
    if(!result || !(await bcrypt.compare(password,result.password))){
       return res.status(401).json({
            status: "fail",
            message: "incorrect email or password"
        })
    }
    const token = generateToken({
        id: result.id,
    })

    return res.json({
        status: 'success',
        token,
    })
    
}
module.exports = { signup,login }