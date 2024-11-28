const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const app = express();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// Cấu hình Cloudinary
cloudinary.config({ 
    cloud_name: 'dhb4wdmjw', 
    api_key: '232461131515197', 
    api_secret: '0B_z30zbBO3NAs3-jVvEB_Z-dg0' 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Petify_Images', // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Các định dạng ảnh cho phép
    }
});

const upload = multer({ storage: storage });
const uploadToCloudinary = async (filePath) => {
    try {
        console.log('Uploading file to Cloudinary:', filePath);
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'Petify_Images', 
        });
        console.log('Upload result:', result);
        return result;
    } catch (error) {
        console.error('Upload to Cloudinary error:', error);
        throw error;
    }
};


app.post('/upload', upload.array('files', 10), async (req, res) => {
    console.log("Request received at /upload endpoint"); 

    if (!req.files || req.files.length === 0) {
        console.error('No files uploaded');
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    console.log('Files received:', req.files); 

    try {
        const uploadResults = [];
        for (const file of req.files) {
            const filePath = file.path;
            console.log("Processing file:", filePath); 

            const result = await uploadToCloudinary(filePath);
            uploadResults.push(result);

            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temp file:', err);
                else console.log('Temporary file deleted:', filePath);
            });
        }

        res.json({ success: true, results: uploadResults });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error });
    }
});
module.exports = {upload, uploadToCloudinary};
