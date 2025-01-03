import { Router } from "express";
import { Upload } from '../middlewares/multer.middleware.js';
import { VerifyJWT } from "../middlewares/Auth.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, publishVideo, updateVideo } from "../controllers/Video.controller.js";

const router = Router()


router.route('/').get(getAllVideos)

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
router.route('/update/:videoId').patch(VerifyJWT , updateVideo)
router.route('/delet/:videoId').delete(VerifyJWT , deleteVideo)


export default router;