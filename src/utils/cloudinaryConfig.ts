import cloudinary from 'cloudinary';

const Cloudinary = cloudinary.v2;

Cloudinary.config({
    api_key: process.env.CLOUND_KEY,
    api_secret: process.env.CLOUd_SECRETE,
    api_name: process.env.CLOUD_NAME
})