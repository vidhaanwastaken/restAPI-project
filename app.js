require('dotenv').config({path: `${process.cwd()}/.env`})
const express = require('express')
const authRouter = require('./route/auth_route');
const catchAsync = require('./utils/catchAsync');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express()


const PORT  = process.env.APP_PORT || 4000;

app.use(express.json())

app.get('/',(req,res)=>{

    res.status(200).json({
        status: "sucess",
        message: "rest API's are working"
    })
})

//all routes will be here   

app.use('/api/v1/auth',authRouter)

app.use(catchAsync (async(req,res,next)=>{
    console.log("here");
    
    
    throw new appError('this is error ', 404);
    
}))


app.use(globalErrorHandler)



app.listen(process.env.APP_PORT,()=>{
    console.log("server up and running");
    
})







