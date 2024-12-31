import { Router } from "express";
import { Upload } from '../middlewares/multer.middleware.js';
import { VerifyJWT } from "../middlewares/Auth.middleware.js"
import { getVideoById, publishVideo, updateVideo } from "../controllers/Video.controller.js";

const router = Router()

router.route('/upload-video').post(
    Upload.fields([
        {
            name: 'videoFile',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ])
    ,
    VerifyJWT,
    publishVideo
)

router.route('/watch/:videoId').get(VerifyJWT , getVideoById)
router.route('/update/:videoId').get(VerifyJWT , updateVideo)


export default router;