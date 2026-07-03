const db = require("../db/models");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const uploadConfig = require("../config/upload");
const uploadFile = require("../utils/s3_service").uploadFile; 
const getObjectSignedUrl = require("../utils/s3_service").getFileUrl;
const getFileUrl = require("../utils/s3_service").getFileUrl;


exports.uploadUserFile = catchAsync(async (req, res, next) => {
    

    const file = req.file;
    const { field } = req.body;

    if (!file) {
        return next(new appError("Please upload a file.", 400));
    }

    const config = uploadConfig[field];

    if (!config) {
        return next(new appError("Invalid upload field.", 400));
    }

    if (!config.allowedMimeTypes.includes(file.mimetype)) {
        return next(new appError("Invalid file type.", 400));
    }

    const uploaded = await uploadFile(file, config.folder);

    await db.users.update(
        {
            [field]: uploaded.key
        },
        {
            where: {
                id: req.users.id
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        data: {
            field,
            key: uploaded.key
        }
    });

});

// exports.getUserFile = catchAsync(async (req, res, next) => {

//     const { field } = req.params;

//     const config = uploadConfig[field];

//     if (!config) {
//         return next(new appError("Invalid file field.", 400));
//     }

//     const key = req.users[field];

//     if (!key) {
//         return next(
//             new appError("No file uploaded for this field.", 404)
//         );
//     }

//     const url = await getObjectSignedUrl(key);

//     res.status(200).json({
//         success: true,
//         data: {
//             field,
//             key,
//             url
//         }
//     });

// });

exports.getUserData = catchAsync(async (req, res, next) => {
    console.log("getUserData req.users:", req.users);
    const user = req.users;

    if (!user) {
        return next(new appError("User not found.", 404));
    }

    
    const userData = user.toJSON();

   
    for (const field of Object.keys(uploadConfig)) {

        const key = userData[field];

        if (key) {
            userData[field] = await getFileUrl(key);
        } else {
            userData[field] = null;
        }

    }

    res.status(200).json({
        success: true,
        data: userData
    });

});

