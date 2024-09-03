import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import { availableExtensions } from './helper.js';
import path from 'path';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from 'uuid';

const REGION = 'ap-south-1';


const s3Client = new S3Client({ 
    region: REGION , 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }});

const s3 = new AWS.S3();

export const uploadFile = async (key, file) => {
    try {
        const profilePicBase64 = Buffer.from(file.buffer);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: profilePicBase64,
            ContentType: file.mimetype,
        };

        const results = await s3Client.send(new PutObjectCommand(params));
        if (!results) {
            return false;
        }
        return true;
    } catch (err) {
        console.log('Error', err);
    }
};

export const getFile = async (key) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        };

        // Generate a presigned URL for the GetObjectCommand
        const command = new GetObjectCommand(params);
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

        return {
            url: presignedUrl,
        };
    } catch (err) {
        console.log('Error', err);
        return null;
    }
};

export async function getUploadUrl() {
    const key = "PDF/" + uuid() + ".pdf";
    const expiresIn = 60 * 5; // 5 minutes
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Conditions: [
            ["content-length-range", 0, 26214400] // Limit the size to 25MB
        ],
        Expires: expiresIn // Expiration time in seconds
    };

    try {
        const data = await createPresignedPost(s3Client, params);
        return data;
    } catch (err) {
        console.error('Error generating presigned URL:', err);
        throw err;
    }
}

export const getObjectsList = async (path) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: `${path}`,
        };

        const existingFiles = [];
        const result = await s3.listObjectsV2(params).promise();
        const contents = result.Contents;

        contents.forEach((Object) => {
            existingFiles.push(Object.Key);
        });

        if (existingFiles?.length > 0) {
            return existingFiles;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
    }
};

export const deleteS3Object = async (path) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: `${path}`,
        };

        const result = await s3.listObjectsV2(params).promise();
        const contents = result.Contents;

        const deletionPromises = contents.map((Object) => {
            const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: Object.Key,
            };
            return s3.deleteObject(deleteParams).promise();
        });

        await Promise.all(deletionPromises);

        return { message: 'Objects deleted successfully' }; // Or similar success message
    } catch (err) {
        console.error('Error deleting objects:', err);
        // Consider returning an error response with details
    }
};

export const handleFileUpload = async (file, uuid) => {
    const extension = path.extname(file.originalname);
    if (!availableExtensions.includes(extension)) {
        throw new Error('Only pdf, doc and docx files are allowed');
    }
    const key = `PDF/${uuid}${extension}`;
    const existingFiles = await getObjectsList(`PDF/${uuid}`);
    if (existingFiles) {
        await deleteS3Object(existingFiles);
    }
    return uploadFile(key, file);
};