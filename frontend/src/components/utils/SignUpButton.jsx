import React, {useState} from 'react'
import {motion} from 'framer-motion'
import { IoLogInOutline } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function SignUpButton() {
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center mr-4">
      <motion.button
        initial="rest"
        animate={isHovered ? "hover" : "rest"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative overflow-hidden px-6 py-[0.4rem] bg-gradient-to-r from-amber-300/95 to-amber-600/95 text-white rounded-full font-medium text-base shadow-lg hover:shadow-amber-500/50 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        whileTap={{ scale: 0.95 }}
        aria-label="Login"
        onClick={()=>navigate('/signup')}
      >
        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: "-150%", transition: { duration: 0.3, ease: "easeInOut" } },
          }}
          className="flex items-center justify-center"
        >
          SignUp <IoLogInOutline className="text-2xl pl-1" />
        </motion.div>

        <motion.div
          variants={{
            rest: { y: "150%" },
            hover: { y: 7, transition: { duration: 0.3, ease: "easeInOut" } },
          }}
          className="flex items-center justify-center absolute top-0 left-0 w-full"
        >
          SignUp <IoLogIn className="text-2xl pl-1" />
        </motion.div>
      </motion.button>
    </div>
  )
}

export default SignUpButton