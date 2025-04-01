import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser) // it will work as suffix so route will be (loaclhost or baseurl)/api/v1/users/register and after dot what controller do you want to use
// for login method
// router.route("/login").post(login)

export default router