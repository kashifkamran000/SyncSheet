import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, removeNotification } from '../../store/notificationSlice.js';
import {motion, AnimatePresence} from 'framer-motion'
import socket from './socket.js'
import Lottie from 'lottie-react';
import Tick from '../../assets/icons8-tick.json'
import Cross from '../../assets/icons8-cross.json'

const NotificationProvider = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const currentUser = useSelector((state)=>state.auth.userData)

  useEffect(() => {
    const handleNotification = (notification) => {
      console.log("got itttttt");
      
      dispatch(addNotification(notification));
  
      setTimeout(() => {
        dispatch(removeNotification({ id: notification.id }));
      }, 5000); // 5 seconds
    };
    socket.emit('join-room', { userId: currentUser?._id });
    socket.on('invite-notification', handleNotification);
    
    return () => {
      socket.off('invite-notification', handleNotification);
    };
  }, [dispatch, currentUser]);

  return (
    <div className="fixed top-0 right-0 p-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 1,
              delay: index * 0.1,
            }}
            className="bg-gradient-to-br from-bg-main via-white to-white text-main-text border-[0.07rem] font-light text-sm border-golden leading-loose  p-4 rounded-lg shadow-lg max-w-xs w-full cursor-pointer hover: transition-colors duration-200"
            onClick={() => dispatch(removeNotification({ id: notification.id }))}
            whileHover={{ scale: 1.03}}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.2}}
            className='flex items-start'>
              <Lottie 
                  animationData={['Invite Accepted' , 'Invite Confirmation' , 'Invite' , 'Invite Sent'].includes(notification.type) ? Tick : Cross} 
                  loop={true}
                  autoplay={true}
                  style={{ width: 25, height: 25}}
                  className='mt-[0.4rem] ml-2 mr-4'      
              />
              <p className='w-[18rem]'>{notification.message}</p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;
