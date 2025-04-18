import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getCurrentUser, getUserById, logoutUser, registerUser, userLogin} from '../controllers/user.controllers.js'
import { googleLogin } from "../controllers/googleAuth.controllers.js";

const router = Router();

router.route('/register').post(upload.single("avatar"), registerUser);

router.route('/login').post(userLogin);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route('/logout').get(verifyJWT, logoutUser);

router.route('/googleLogin').get(googleLogin);

router.route('/user/:id').get(verifyJWT, getUserById);

export default router;