import {useGoogleLogin} from "@react-oauth/google";
import { googleAuth } from '../utils/googleApi.js'
import { FcGoogle } from "react-icons/fc";
import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/authStore.js";
import {motion} from 'framer-motion'

function GoogleLoginSignup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLoginWithGoogle = async(authResult)=>{
        try {
          if(authResult.code){
            const result = await googleAuth(authResult.code);
            dispatch(login(result.data?.data)); 
            navigate('/');
          }
        } catch (error) {
          console.error('Google login failed:', error);
        }
      }
    
      const googleLogin = useGoogleLogin({
        onSuccess: handleLoginWithGoogle,
        onError: handleLoginWithGoogle, 
        flow: 'auth-code'
      })
  return (
    <motion.div 
    initial={{scale: 1}}
    whileHover={{scale: 1.04}}
    whileTap={{scale: 0.95}}
    className="bg-bg-main p-2 mt-5 px-4 rounded-lg border-[0.07rem] flex justify-center items-center ">
      <button className="flex justify-center items-center font-medium text-main-text/90 " onClick={googleLogin}>Google <span className="mx-2"> <FcGoogle size={20}/></span></button>
    </motion.div>
  )
}

export default GoogleLoginSignup