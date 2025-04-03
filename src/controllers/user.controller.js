import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/uploadFile.js"
import {ApiResponse} from "../utils/apiResponse.js"

const genrateAccessAndRefreshToken = async(userId)=>{
    // generate access and refresh token
    try {

       const user = await User.findById(userId)
       const accessToken = user.genrateAccessToken()
       const refreshToken = user.genrateRefreshToken()
       user.refreshToken = refreshToken

       await user.save({validateBeforeSave: false}) // when you go to save the data then password will be required then {validateBeforeSave: false} this will help you to save like it will save withoud validation error

       return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while genrating access and refresh token")

    }


}

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
// console.log(email, userName, fullName, password)
if([fullName, email, userName, password].some((field)=>{
    field?.trim() === ""
})){
    throw new ApiError(400,"All fields are required", )
}

// find if user is already exist
const existedUser = await User.findOne({
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
// console.table(req.files)
const avatarLoacalPath = req.files?.avatar[0]?.path // this will give you local path form multer which have files property for avatar
// const coverImageLocalPath = req.files?.coverImage[0]?.path; // this will give you local path form multer which have files property for cover image
let coverImageLocalPath

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
}
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
    userName:userName,
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


const loginUser = asyncHandler(async(req,res)=>{

    //teke data from req.body
    // check if username or email are available
    // find the user
    // compare password
    // if password is correct then generate token like referesh token and access token
    // send secure cookies

     const {email, userName, password} =   req.body
     if(!userName || !password){
        throw new ApiError(400, "username or email required !!")
     }

     //find the user in database

    const user = await User.findOne({  // this user will hold that property which we make in model like is password correct, getnrateRefreshToken and genrateAccessToken
        $or:[
            {userName},
            {email}
        ]
     })

     // if user is not found
     if(!user){
        throw new ApiError(401, "Invalid username or password")
     }

     // Note: Do not use isPassword correct from User alwase use form user which you made here

   const isPasswordValid =  await user.isPasswordCorrect(password)

     if(!isPasswordValid){
        throw new ApiError(401, "Invalid user Credentials")
     }

    const {accessToken, refreshToken} = await genrateAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={ // this two options will secure your cookie only modified by server not from client side
        httpOnly: true,
        secure:true
    }
    
    return res.status(200)
    .cookie("accessToken", accessToken, options) // we are accessing this cookie because of cookieParser which in app.js
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedUser, accessToken, refreshToken  // here it is not a good practice but maybe user want to make mobile apps or he want to save locally so it will be helpful

            },
            "User LoggedIn Successfully"
        )
    )

})

const logOutUser = asyncHandler(async(req, res)=>{
   User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            refreshToken:undefined,
        }
    },
{
    new:true,
    
}
   ) 

   const options ={
       httpOnly: true,
        secure:true
 
   }


   return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(
    new ApiResponse(
        200,
        {},
        "User Logged Out Successfully"
    )
   )
})

export {
    registerUser,
    loginUser,
    logOutUser
}