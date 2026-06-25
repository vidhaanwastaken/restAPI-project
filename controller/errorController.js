const appError = require("../utils/appError")

// const sendErrorDev = (error,res)=>{
// console.log("send error dev");
//     const statusCode = error.statusCode || 500
//     const status = error.status || 'error'
//     const message = error.message
//     const stack = error.stack
//     console.log(message);
    

//     return res.status(500).json({
//         status: 'error',
//         message: 'something went very wrong'
//     })
// }
const sendErrorDev = (error, res) => {
    console.log("i am inside senderrordev");
    console.log(error);

    return res.status(500).json({
        status: 'error',
        message: error.message,
        // stack: error.stack
    });
}

const sendErrorProd = (error,res)=>{
    const statusCode = error.statusCode || 500
    const status = error.status || 'error'
    const message = error.message
    const stack = error.stack

    if(error.isOperational){
    return res.status(statusCode).json({
        status,
        message,
    })
    }
    console.log(error.name, error.message, stack);
    return res.status(500).json({
        status: 'error',
        message: 'something went very wrong'
    })
}





const globalErrorHandler = (err, req, res, next)=>{
    if(err.name === 'SequelizeValidationError') {
        
        err = new appError(err.errors[0].message, 400);
        
     }
    
    if(err.name === 'SequelizeUniqueConstraintError') {
        err = new appError(err.errors[0].message, 400);
     }
    if(process.env.NODE_ENV === 'development'){
        // console.log("err", err)
        return sendErrorDev(err,res)
    }
    
    sendErrorProd(err,res)


}
module.exports = globalErrorHandler