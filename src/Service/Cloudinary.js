import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return

        //upload the file on cloudinary 

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        })

        // file has been uploaded 
        console.log('file has been successful uploading ', response.url)

        return response
    } catch (error) {
        fs.unlinkSync(localfilepath) // remove localfile saved file if the upload operation failed 
        return null
    }
}