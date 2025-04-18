import React, {useEffect, useState} from 'react'
import { IoPersonAddOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Input from '../../utils/Input';
import { useForm } from 'react-hook-form';
import { BsSend } from "react-icons/bs";
import { IoReaderOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import qs from 'qs';
import { FcCancel } from "react-icons/fc";
import axios from 'axios';
import Errorr from '../../utils/Error';
import LoadingCircular from '../../utils/Loading/LoadingCircular';

function InviteButton({docId}) {
  const [inviteWindow, setInviteWindow] = useState(false);
  const [inviteSendStatus, setInviteSendStatus] = useState(false);
  const {register: inviteRegister, handleSubmit: inviteHandleSubmit, formState: {errors: inviteError}, reset: inviteReset} = useForm();
  const [previousInvites, setPreviousInvites] = useState([]);
  const [selectedInviteType, setSelectedInviteType] = useState('');
  const queryClient = useQueryClient();

  const handleOptionSelect = (value) => {
    setSelectedInviteType(value);
  };

  const {data = [], isLoading, isError, error} = useQuery({
    queryKey: [`/editor/${docId}/Invite`],
    queryFn: async ()=>{
      const response = await axios.get(`/api/v1/invitation/allPending/${docId}`, {
        withCredentials: true
      })
      if(response.status === 200){
        return response.data?.data || []; 
      }
      throw new Error('Failed to fetch invites');
    }
  })

    useEffect(() => {
      // Only update if data is truthy and different from previous invites
      if (data && JSON.stringify(data) !== JSON.stringify(previousInvites)) {
        setPreviousInvites(data);
      }
  }, [data])

  const handleInviteSend = async(formData)=>{
    try {
      const permission = selectedInviteType.length > 0 ? ( selectedInviteType === 'Read' ? 'read-only' : 'read-write') : 'read-only';
      const payload = qs.stringify({email: formData.email, permission: permission});

      const response = await axios.post(`/api/v1/invitation/sendInvite/${docId}`, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
      })

      if(response.status===200){
        return response.data?.data;
      }
    } catch (error) {
      console.error('Error sending request:', error);
      throw error;
    }
  }

  const {mutate} = useMutation({
    mutationFn: handleInviteSend,
    onSuccess: (data)=>{
      setTimeout(()=>{
        queryClient.invalidateQueries([`/editor/${docId}/Invite`]);
        setSelectedInviteType('');
        setInviteSendStatus(false);
        inviteReset();
      }, 2500)
    },
    onError: (error)=>{
      console.log(error);
      
    }
  })

  const handleCancelInvite = async (inviteId)=>{
    try {
      const response = await axios.get(`/api/v1/invitation/cancelInvite/${docId}/${inviteId}`, {withCredentials: true});
      if(response.status===200){
        return inviteId;
      }
    } catch (error) {
      console.log("error while canceling request: ", error);
    }
  }

  const {mutate: cancelInviteMutate} = useMutation({
      mutationFn: handleCancelInvite,
      onSuccess: (canceledInviteId)=>{
          queryClient.setQueryData([`/editor/${docId}/Invite`], (oldData)=>{
            return oldData.filter((invite)=>invite._id !== canceledInviteId);
          })
      }
  })

  if (isLoading) {
    return <LoadingCircular/>
  }

  if (isError) {
    return <Errorr message={error.message}/>
  }

  return (
    <div>
        <button 
        onClick={()=>setInviteWindow(true)}
        className='flex items-center gap-3 px-3 py-2 rounded-md text-main-text bg-white shadow-sm font-light text-sm border-[0.01rem]'>
            Invite <IoPersonAddOutline />
        </button>

        <AnimatePresence>
          {inviteWindow && (
              <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setInviteWindow(false)}
              >
                  <motion.div
                      className="bg-bg-main p-8 rounded-xl w-[40rem]"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                  >
                    <div className='flex items-center font-extralight text-2xl'>
                      Invites <span className='pl-4'> <IoPersonAddOutline/></span>
                    </div>
                    
                    <div className='border-[0.1rem] p-5 mt-7 rounded-xl'>
                      Invite User:
                      <div className='mt-5'>
                        <form onSubmit={inviteHandleSubmit((data)=>mutate(data))} className='flex '>
                          <div className='w-1/2'>
                            <Input 
                            label="Email"
                            {...inviteRegister("email", { required: 'Email is required' })}
                            error={inviteError.email?.message}
                            />
                          </div>
                          <div className="relative p-3 h-[7rem] place-content-center">
                          <FlyoutLink FlyoutContent={() => <PricingContent onSelect={handleOptionSelect} />}>
                              <div className="rounded-xl text-sm border-[0.07rem] px-5 py-2 h-10 cursor-pointer">
                              {selectedInviteType || "Access"}
                              </div>
                            </FlyoutLink>
                          </div>
                         <div className='h-[7rem] place-content-center'>
                          <button className='border-[0.07rem] overflow-hidden px-5 py-2 h-10 rounded-xl ' 
                            type='submit' 
                            onClick={()=>setInviteSendStatus(!inviteSendStatus)}>
                              <div className='flex items-center justify-between'>
                                Send
                                <motion.div
                                initial={{x: 0, y: 0, opacity: 1}}
                                animate={{x: inviteSendStatus ? 31 : 0, y: inviteSendStatus ? -21 : 0, opacity: inviteSendStatus ? 0 : 1}}
                                transition={{delay: 0.5, ease: 'easeInOut', repeatType: 'loop'}}
                                className='ml-3'
                                >
                                <BsSend />
                                </motion.div>
                              </div>
                            </button>
                         </div>
                        </form>
                      </div>
                    </div>

                    <div className='border-[0.1rem] p-5 mt-3 rounded-xl'>
                      <div className='mb-2'>Pending Invites:</div>
                      {previousInvites && previousInvites.length===0 ?
                        <>
                          <div className=' h-[5rem] flex justify-center items-center'>
                            <span className='font-extralight opacity-50'>No Pending Invites</span>
                          </div>
                        </> :
                        <div className={`${previousInvites?.length >= 3 ? "h-[13rem] overflow-y-scroll" : "h-[auto]"}  p-2`}>
                          {
                            previousInvites.map((pendingInvite)=>(
                              <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.03 }}
                                key={pendingInvite._id}
                                className="group border-[0.07rem] rounded-lg my-3 p-3 flex items-center text-sm justify-between font-light"
                              >
                                <div className="group-hover:scale-105 transform transition duration-200 ">
                                  To : {pendingInvite.invitedUserName}
                                  <div className="text-xs opacity-70">{pendingInvite.invitedUserEmail}</div>
                                </div>
                                <div className="">{
                                  pendingInvite.permission === 'read-only' ? (<div className='flex items-center'>
                                  <span className='px-2 flex'><IoReaderOutline /></span> Read</div>) : 
                                  (<div className='flex items-center'>
                                    <span className='px-2'><CiEdit /></span> Write
                                  </div>)
                                  }
                                </div>
                                <div className="">{pendingInvite.status.charAt(0).toUpperCase()+pendingInvite.status.slice(1)} 
                                <motion.i
                                  initial={{ scale: 0, opacity: 0.8 }}
                                  animate={{ scale: 1, opacity: 0 }}
                                  transition={{
                                    duration: 1.2,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    repeatDelay: 0.1, 
                                  }}
                                  className="fa-solid fa-circle ml-2"
                                />
                                </div>
                                <div
                                onClick={()=>cancelInviteMutate(pendingInvite._id)} 
                                className="flex items-center w-[6rem] justify-between p-1 px-3 rounded-lg hover:text-red-600 hover:bg-red-600/5 hover:scale-105 transition transform duration-300 ease-in-out active:scale-90">
                                  Cancel<FcCancel />
                                </div>
                              </motion.div>
                            ))
                          }
                        </div>
                      }
                    </div>
                    
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>  
    </div>
  )
}

const FlyoutLink = ({ children, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={()=>setOpen(true)}
      className="relative w-fit h-fit"
    >
      <div className="relative text-main-text w-[7.5rem] text-center">
        {children}
      </div>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-bg-main border-t-[0.07rem] border-l-[0.07rem]" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingContent = ({ onSelect }) => {
  return (
    <div className="w-[7.9rem] bg-bg-main p-6 rounded-xl border-[0.07rem] shadow-xl text-main-text">
      <div className="space-y-5">
        <div
          onClick={() => onSelect("Read")}
          className="flex items-center justify-center text-sm hover:scale-105 ease-in-out w-full text-center"
        >
          <span className='px-2'><IoReaderOutline /></span> Read
        </div>
        <div
          onClick={() => onSelect("Write")}
          className="flex text-sm hover:scale-105 w-full text-center"
        >
          <span className='px-2'><CiEdit /></span> Write
        </div>
      </div>
    </div>
  );
};

export default InviteButton