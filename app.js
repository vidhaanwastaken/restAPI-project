require('dotenv').config({path: `${process.cwd()}/.env`})
const express = require('express')
const authRouter = require('./route/auth_route');
const catchAsync = require('./utils/catchAsync');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const db = require('./db/models');

const app = express()


const PORT  = process.env.APP_PORT || 4000;

app.use(express.json())


//all routes will be here   

app.use('/api/v1/auth',authRouter)

app.use(catchAsync (async(req,res,next)=>{
    console.log("here");
    
    
    throw new appError(`cant find ${req.originalUrl} on this server`, 404)
    
}))


app.use(globalErrorHandler)

const startServer = async () => {
    await db.sequelize.sync();
    app.listen(PORT, () => {
        console.log('server up and running');
    });
};

startServer();







