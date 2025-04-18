import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new Schema({
    username: {
        type: String, 
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    }, 
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true
    },
    documents: [{
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document'
        },
        permission: {
            type: String,
            enum: ['read-only', 'read-write'],
            default: 'read-only'
        }
    }],
    password: {
        type: String,
        required: true
    }, 
    refreshToken: {
        type: String
    }
}, {timestamps: true})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log("Error comparing password:", error);
        return false;         
    }
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);