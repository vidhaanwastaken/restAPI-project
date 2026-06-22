const appError = require("../utils/appError")

const sendErrorDev = (error,res)=>{
console.log("send error dev");
    const statusCode = error.statusCode || 500
    const status = error.stautus || 'error'
    const message = error.message
    const stack = error.stack
    console.log(message);
    
    // res.status(statusCode).json({
    //     status,
    //     message,
    //     status,
    // })

    return res.status(500).json({
        status: 'error',
        message: 'something went very wrong'
    })
}

const sendErrorProd = (error,res)=>{
    const statusCode = error.statusCode || 500
    const status = error.stautus || 'error'
    const message = error.message
    const stack = error.stack
    if(error.isOperational){

    // res.status(statusCode).json({
    //     status,
    //     message,
    //     status,
    // })
    }

    return res.status(500).json({
        status: 'error',
        message: 'something went very wrong'
    })
}





const globalErrorHandler = (err, req, res, next)=>{
    
    
    if(process.env.NODE_ENV === 'development'){
        return sendErrorDev(err,res)
    }
    sendErrorProd(err,res)


}
module.exports = globalErrorHandler