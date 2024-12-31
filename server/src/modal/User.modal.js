import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: {
            url : String ,
            public_Id :String
        },
        required: true
    },
    coverImage: {
        type : {
            url : String ,
            public_Id : String
        }
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }],
    password: {
        type: String,
        required: [true, "Password is required "]
    },
    refeshToken: {
        type: String
    }

}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// my own method to check passowrd 
userSchema.methods.isPasswordCorrected = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generatedAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SCRECT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPERIY
        }
    )
}

userSchema.methods.generatedRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPERIY
        }
    )
}

export const User = mongoose.model("User", userSchema)