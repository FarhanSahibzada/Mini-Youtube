import { Router } from "express";
import { VerifyJWT } from "../middlewares/Auth.middleware.js";
import { getSubcriberVideos, toggleSubcription } from "../controllers/Subcription.controller.js";



const router = Router();

router.route("/toggle-subcriber/:channelId").get(VerifyJWT , toggleSubcription)
router.route('/getSubcriber-video').get(VerifyJWT , getSubcriberVideos)




export default router;