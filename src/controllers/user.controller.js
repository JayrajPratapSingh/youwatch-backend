import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/uploadFile.js"
import {ApiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler(async(req, res) => {
  // Get User Details form from frontend
  // validations - not empty //you can make more validation for email and other validation in a seprate file as method and you can call them and use to varify 
  // check if user is alreaday registered: user name and email
  //  check for images, check for avatar
  // upload then to cloudinary - reference to clodinary like url
  // create user object - create ientry in db
  //  remove user password and referesh token field form response
  // check if user created successfully
  // return response to client

  // if data comes form form or json then direct take form body
const {userName, fullName, email, password} = req.body 
console.log(email, userName, fullName, password)
if([fullName, email, userName, password].some((field)=>{
    field?.trim() === ""
})){
    throw new ApiError(400,"All fields are required", )
}

// find if user is already exist
const existedUser = User.findOne({
    $or:[ // give array of object fields which you want to find
        {userName},
        {email}
    ]
})

// If user exists then throw error

if(existedUser){
    throw new ApiError(409, "User already registered !!" )
}

// check if file is exist or not
const avatarLoacalPath = req.files?.avatar[0]?.path // this will give you local path form multer which have files property for avatar
const coverImageLocalPath = req.files?.coverImage[0]?.path; // this will give you local path form multer which have files property for cover image

if(!avatarLoacalPath){
    throw new ApiError(400, "Please upload avatar image" )
}

// Now upload to cloudinary

const avatar = await uploadOnCloudinary(avatarLoacalPath)
const coverImage  = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
throw new ApiError(400, "Please upload avatar")
}

const user = User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    userName:userName.toLowarCase(),
    email,
    password,
})

const createdUser = await User.findById(user._id).select(  // the select method is use to ignore which you do not want to send your client
    "-password -refreshToken"  //wierd syntax 
) //full proof if user created


if(createdUser){
    throw new ApiError(500, "Something went wrong while creating a user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "user registered successfully")
)


}
)

export {registerUser}