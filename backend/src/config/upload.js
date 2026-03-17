import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "./env.js";

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const storage = multer.memoryStorage({});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 8,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Apenas imagens permitidas"), false);
        }
    },
})

const deleteImage = async (publicId) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    cloudinary,
    storage,
    upload,
    deleteImage
};