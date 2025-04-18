import React from 'react'
import {motion} from 'framer-motion'

function Logo({size='text-2xl', animate=true, className=''}) {
  return (
        <motion.div 
            initial={animate ? { scale: 0 }: false}
            animate={{ scale: 1 }}
            style={{ display: 'inline-block', textAlign: 'center' }} 
            className={`font-extralight ${size} ${className}`}>
                SyncSheet
                <i className="uil uil-link text-golden ml-1"></i>
        </motion.div>
  )
}

export default Logo