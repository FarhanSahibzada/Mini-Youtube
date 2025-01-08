import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylist,
    removeVideoFromPlaylist
} from "../controllers/Playlist.controller.js";
import { VerifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()

router.route('/create').post(VerifyJWT, createPlaylist)
router.route('/:userId').get(VerifyJWT, getUserPlaylist)
router.route('/get-Playlist/:playlistId').get(VerifyJWT, getPlaylistById)
router.route('/add-video/:playlistId/:videoId').patch(VerifyJWT, addVideoToPlaylist)
router.route('/remove-video/:playlistId/:videoId').patch(VerifyJWT, removeVideoFromPlaylist)
router.route('delet/:playlistId').delete(VerifyJWT, deletePlaylist)





export default router;