import React, {useState} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import timeCalculator from '../../utils/timeCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import Error from '../../utils/Error';
import LoadingCircular from '../../utils/Loading/LoadingCircular';

function Profile() {
    const {userId} = useParams();
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);


    const {data, isLoading, isError, error} = useQuery({
        queryKey: ['user', userId],
        queryFn: async()=>{
         try {
            const response = await axios.get(`/api/v1/user/user/${userId}`, {withCredentials: true});

            if(response.status===200){
                return response.data?.data;
            }else {
                throw new Error(`Unexpected response status: ${response.status}`);
              }      
         } catch (error) {
            console.log(error, "Error in Query"); 
         }   
        }
    })


    if(isLoading){
        return (
          <LoadingCircular/>
        )
      }
    
      if(isError){
        return (
          <Error message={error.message}/>
        )
      }

  return (
    <div className="w-full h-full flex justify-center items-center p-7 text-main-text font-light overflow-hidden"> 
        <div className=" bg-white  p-9 rounded-xl relative w-[25rem]  h-auto space-y-4 flex flex-col items-center z-10 border-golden border-[0.07rem] shadow-lg">
               <div onClick={() => setAvatarModalOpen(true)} className=' cursor-pointer'>
                <motion.img 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={data.avatar} 
                  alt={`${data.fullName}'s avatar`}
                  className="w-[11rem] h-[11rem] object-cover rounded-full shadow-inner "
                  />
               </div>
                <motion.div
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-2 pt-3"
                >
                    <div>Full Name: <span className="font-medium">{data.fullName}</span></div>
                    <div>Username: <span className="font-medium">{data.username}</span></div>
                    <div>Email: <span className="font-medium">{data.email}</span></div>
                    <div>Joined: <span className="font-medium">{timeCalculator(data.createdAt)}</span></div>
                </motion.div>
                
        </div>
                
      <AnimatePresence>
          {avatarModalOpen && (
              <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setAvatarModalOpen(false)}
              >
                  <motion.div
                      className="bg-gray-box p-4 rounded-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                  >
                      <img 
                          src={data?.avatar} 
                          alt="ProfileImage" 
                          className="w-[30rem] h-[30rem] object-cover rounded-lg"
                      />
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      
    </div>

    

  )
}

export default Profile