import { Asynchandler } from "../utils/Asynchandler.js"
import { ApiError } from "../utils/APIerror.js"
import jwt from "jsonwebtoken"
import { User } from "../modal/User.modal.js"

export const VerifyJWT = Asynchandler(async (req, _, next) => {
    try {
        const Token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!Token) {
            throw new ApiError(401, "Unauthorizeed request");
        }
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SCRECT)
        const user = User.findOne(decodedToken._id).select("-passowrd  -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user ;
        next()
    } catch (error) {
        throw new ApiError(401 , "Invalid Access Token");        
    }

})