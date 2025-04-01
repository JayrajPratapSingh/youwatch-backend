// cloudinary

import { v2 as cloudinary} from 'cloudinary'; //from clloudinary package
import fs from 'fs'; // node file system

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET
})

const uploadOnCloudinary = async(loacalFilePath)=>{
    try{
        if(!loacalFilePath) return null;
        //upload file on cloudinary

        const response = await cloudinary.uploader.upload(loacalFilePath, {
            resource_type:"auto",
        })

        // file is uploaded on cloudinary

        console.log("file is uploaded on cloudinary", response.url)
        return response

    }
    catch(error){
        fs.unlinkSync(loacalFilePath) // remove the locally saved file as the upload opration got failed
    }
}

export {uploadOnCloudinary}