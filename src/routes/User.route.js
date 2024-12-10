import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/User.controller.js";
import { Upload } from '../middlewares/multer.middleware.js';
import {VerifyJWT } from "../middlewares/Auth.middleware.js"

const router = Router()

router.route('/register').post(
    Upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(
    loginUser
)

// secure Routes 
router.route("/logout").post(VerifyJWT, logoutUser)



export default router
