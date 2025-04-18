import React from 'react'
import Lottie from 'lottie-react'
import errorAnimation from '../../assets/Error.json'
import errorr from '../../assets/Erro!.json'
import { motion } from 'framer-motion'

function Error({message = "Something went wrong, Please try again!"}) {
  return (
    <div className='w-full flex justify-center items-center h-[30rem]'>
        <div className='border-[0.07rem] border-light-golden h-[22rem] w-[50rem] rounded-2xl bg-gradient-to-r from-light-golden/10 via-light-golden/5 to-white flex overflow-hidden items-center justify-between p-2 pl-10'>
            <div>
                <motion.div 
                initial={{x : 0}}
                animate={{x: [0, -10, 10, -10, 10, 0]}}
                transition={{duration: 0.3, ease: "easeInOut", repeatDelay: 3, repeat: Infinity}}
                className='flex items-end'>
                    <Lottie 
                        animationData={errorr} 
                        loop={false}
                        autoplay={true}
                        style={{ width: 50}}
                        
                    />
                    <span className='pb-1 text-golden'>Error!</span>
                </motion.div>
                <div className='text-golden mt-4 w-[15rem] h-[10rem] font-light'>
                    {message}
                </div>
            </div>
            <div>
                <Lottie 
                    animationData={errorAnimation} 
                    loop={true}
                    autoplay={true}
                    style={{ width: 500 }}
                />
            </div>
        </div>
       
    </div>
  )
}

export default Error