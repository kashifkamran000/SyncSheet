import React, { useMemo, useRef } from 'react';
import {motion, useInView} from 'framer-motion'
import Logo from '../../utils/Logo'
import undraw01 from '../../../assets/undraw01.svg'
import undraw02 from '../../../assets/undraw02.svg'

const GoldenGlittery = () => {
  const divRef = useRef();
  const inView = useInView(divRef, {once: true, amount: 0.5});

  const sparkles = useMemo(() => {
    return Array.from({ length: 300 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 1+1}px`,
      duration: `${Math.random() * 10 + 1}s`
    }));
  }, []);

  return (
    <motion.div
      ref={divRef}
      initial={{y: 50, opacity: 0}}
      animate={{y: inView ? 0 : 50, opacity: inView ? 1 : 0}}
      transition={{duration: 0.8, ease: 'easeInOut'}}
      className="relative w-[50rem] h-[30rem] rounded-lg p-6 cursor-pointer"
      style={{
        background: '#b8860b',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
            animation: `sparkle ${sparkle.duration} linear infinite`,
          }}
        />
      ))}
      <div className="relative z-10 flex justify-center">
        <div className='leading-loose text-center'>
          <h4 className='text-bg-main font-light my-8 pr-8' style={{wordSpacing: '0.2rem'}}>Hello Folks, Welcome to </h4>
          <h2 className="text-2xl font-bold text-white mb-2"><Logo size='text-5xl' animate={false}/></h2>
          <p className='text-bg-main font-extralight px-10 leading-[2.5rem] mt-16' style={{wordSpacing: '0.2rem'}}>Your go-to platform for seamless document collaboration. Edit, share, and work together in real time, effortlessly managing projects and files. Experience the future of teamwork today!</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <motion.img initial={{y: 20, opacity: 0}} animate={{opacity: inView ? 1 : 0, y: inView ? 0 : 20}} transition={{duration: 0.8, delay: 0.8}} src={undraw01} alt=""  className='absolute w-[20rem] -bottom-24 -right-32 z-30'/>
      <motion.img initial={{y: 20, opacity: 0}} animate={{opacity: inView ? 1 : 0, y: inView ? 0 : 20}} transition={{duration: 0.8, delay: 0.8}} src={undraw02} alt=""  className='absolute w-[15rem] -bottom-24 -left-32 z-30'/>
    </motion.div>
  );
};

export default GoldenGlittery;