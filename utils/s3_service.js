const {PutObjectCommand,GetObjectCommand,} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const path = require("path");

const s3Client = require("../config/s3");

const uploadImage = async (file) => {
    const uniqueName =
        crypto.randomBytes(16).toString("hex") 
        path.extname(file.originalname);

    const key = `users/${uniqueName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3Client.send(command);

    return key;
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
    uploadImage,
    generateSignedUrl,
};