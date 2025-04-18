import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'


const generateRefreshAndAccessToken = async(userID)=>{
    try {
        const user = await User.findById(userID);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken  = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {refreshToken, accessToken};

    } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async(req, res)=>{
    const {fullName, email, username, password } = req.body;

    if([fullName, email, username, password].some((field)=>field?.trim()==='')){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists, please login")
    }

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(400, "Error uploading avatar please try again")
    }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong, server error, please try again");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

const userLogin = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;

    if (!username && !email) {
        throw new ApiError(404, "Username or email is required");
    }
    
    if (!password) {
        throw new ApiError(404, "Password is required");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!existedUser){
        throw new ApiError(401, "User dose not exist, please register");
    }

    const isPassword = await existedUser.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(401, "Incorrect password, please try again");
    }

    const {refreshToken, accessToken} = await generateRefreshAndAccessToken(existedUser._id);

    await User.findByIdAndUpdate(existedUser._id, { refreshToken });

    const loginUser = await User.findById(existedUser._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loginUser, "Successfully login!")
    )
})

const logoutUser = asyncHandler(async(req, res)=>{

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "No user found to log out");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    const options = {
        httpOnly: true, 
        secure: true, 
        sameSite: 'None'
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(200, {}, "Logged out Successfully")
    )
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshAccessToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorised request - No refresh token")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token expired or doesn't match");
        }

        const { refreshToken: newRefreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true, 
            sameSite: 'None'
        };

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
        );
    } catch (error) {
        return res
            .status(401)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(new ApiResponse(401, {}, "Session expired, please log in again"));
    }
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const getUserById = asyncHandler(async(req, res)=>{
    const {id} = req.params;

    if(!id){
        throw new ApiError(404, "Please provide a valid ID")
    }

    const user = await User.findById(id).select('-password -refreshToken');

    if(!user){
        throw new ApiError(404, "No such user found");
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, user, "Done!")
    )
})

export {
    registerUser, 
    userLogin,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    generateRefreshAndAccessToken,
    getUserById
}