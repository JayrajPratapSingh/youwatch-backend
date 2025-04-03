import {Router} from "express"
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([    //this is like a middleware
        {name:"avatar",
        maxCount: 1,
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
) // it will work as suffix so route will be (loaclhost or baseurl)/api/v1/users/register and after dot what controller do you want to use


// for login method
router.route("/login").post(loginUser)

//secured Route

router.route("/logout").post(verifyJWT, logOutUser) // now you can understand the use of next like when veryfyJWT work will be done then next will say got to logOutUser if ther will be no other functions then it will directly give response 

export default router