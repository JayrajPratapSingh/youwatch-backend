import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

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
// router.route("/login").post(login)

export default router