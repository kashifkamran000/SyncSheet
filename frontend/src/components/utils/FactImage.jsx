import React, {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import getFact from './facts'

function FactImage({img}) {
    const [currentFact, setCurrentFact] = useState(getFact());

    useEffect(() => {
        const factInterval = setInterval(() => {
        setCurrentFact(getFact());
        }, 8000);

        return () => clearInterval(factInterval);
    }, []);
  return (
    <div className='rounded-xl relative mb-5 lg:mb-0 overflow-hidden'>
    <img 
      src={img} 
      alt="loginPage" 
      className='w-[30rem] rounded-xl border-golden border-[0.1rem]'
    />
    <div className='absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/80 to-transparent text-bg-main text-center p-8 pb-5 flex justify-center items-end '>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentFact.fact} 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 10 }} 
          transition={{ duration: 0.5 }} 
          className='font-light text-sm leading-loose space-x-10'
        >
        {currentFact.fact} <br/>
        - {currentFact.author}
        </motion.div>
        </AnimatePresence>
    </div>
  </div>
  )
}

export default FactImage