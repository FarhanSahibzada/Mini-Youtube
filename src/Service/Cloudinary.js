import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
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
        fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath) // remove localfile saved file if the upload operation failed 
        return null
    }
}

const RemoveOldImageFromCloudinary = async (oldAvatarUrl) => {
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    const public_id = matches[1]
    if (matches) {
        try {
            await cloudinary.uploader.destroy(public_id)
        } catch (error) {
            console.log("failed to delet old avatar  ", error);
        }
    }
}



export { UploadOnCloudinary, RemoveOldImageFromCloudinary }