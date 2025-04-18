import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {oauth2client} from "../utils/googleConfig.js"
import axios from 'axios'
import {User} from "../models/user.model.js"
import { generateRefreshAndAccessToken } from "./user.controllers.js";

const googleLogin = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        throw new ApiError(400, "Authorization code is required.");
    }

    try {
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);

        const { email, name, picture } = userRes.data;

        if (!email) {
            throw new ApiError(400, "Google login failed: email is required.");
        }

        let existingUser = await User.findOne({ email });

        if (!existingUser) {
            existingUser = await User.create({
                fullName: name,
                email,
                username: email.split('@')[0], 
                avatar: picture,
                password: Math.random().toString(36).slice(-8), 
            });
        }

        const { refreshToken, accessToken } = await generateRefreshAndAccessToken(existingUser._id);

        await User.findByIdAndUpdate(existingUser._id, { refreshToken });

        const loginUser = await User.findById(existingUser._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: 'production', 
            sameSite: 'None'
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, loginUser, "Successfully logged in with Google!")
            );
    } catch (error) {
        console.error("Error during Google login:", error.response?.data || error.message);
        throw new ApiError(500, "Failed to authenticate with Google.");
    }
});


export {
    googleLogin
}