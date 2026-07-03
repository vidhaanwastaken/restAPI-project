const {PutObjectCommand,GetObjectCommand,} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const path = require("path");

const s3Client = require("../config/s3");

// const uploadFile = async (file,folder) => {
//     // const uniqueName =
//     //     crypto.randomBytes(16).toString("hex") 
//     //     path.extname(file.originalname);

//     const key = `${folder}/${uniqueName}`;

//     const command = new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//     });

//     await s3Client.send(command);

//     return key;
// };



const uploadFile = async (file, folder) => {

    const uniqueName =
        crypto.randomBytes(16).toString("hex") +
        path.extname(file.originalname);

    const key = `${folder}/${uniqueName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    });

    await s3Client.send(command);

    return {
        
        fileName: uniqueName
    };
};

const getFileUrl = async (key) => {

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    });

    return await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn: 3600
        }
    );
};

const generateSignedUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: 10,
    });

    return url;
};

module.exports = {
    uploadFile,
    generateSignedUrl,
    getFileUrl, 
};