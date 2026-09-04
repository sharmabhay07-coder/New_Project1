const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            return resolve(null);
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                public_id: originalName ? originalName.split('.')[0] : undefined,
                timeout: 600000, // 10 minutes timeout for large files
                phash: true
            },
            (error, result) => {
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

module.exports = { uploadOnCloudinary };
