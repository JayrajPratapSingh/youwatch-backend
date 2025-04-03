import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"

export const verifyJWT = asyncHandler(async(req, _, next)=>{  // some time we do not use response so we can use _ instead
   try {
     //get token first
     // either you can take token from req.cookies or client will send it in headers in Authorization
     const token = req.cookies?.accessToken || req.header("Authoraization")?.replace("Bearer ", "") // we are using the cookie because of cookieParser and we also added accessToken in login Time then we can get is form there also
     
     if(!token){
         throw new ApiError()
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user){
 
         
         throw new ApiError(401, "Invalid Access Token")
     }
 
     req.user = user;
     next()
 
   } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
   }
})