import {
    FiAtSign,
    FiChevronDown
  } from "react-icons/fi";
  import { motion } from "framer-motion";
  import { useState } from "react";
  import { IoReaderOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

  
  const AccessDropDown = ({permissions, owner, docId}) => {
    const [open, setOpen] = useState(false);
  
    return (
      <div className="relative z-20">
        <motion.div animate={open ? "open" : "closed"} className="relative">
          <button
            onClick={() => setOpen((pv) => !pv)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-main-text bg-white shadow-sm transition-colors border-[0.01rem]"
          >
            <span className="font-light text-sm">Access</span>
            <motion.span variants={iconVariants}>
              <FiChevronDown />
            </motion.span>
          </button>
  
          <motion.ul
            initial={wrapperVariants.closed}
            variants={wrapperVariants}
            style={{ originY: "top", translateX: "-50%" }}
            className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-52 overflow-hidden"
          >
            {
              permissions?.length > 0 ? permissions.map((perm)=>(
                <Option key={perm._id} setOpen={setOpen} Icon={FiAtSign} text={perm.userId.username} isReadOnly={perm.permission === 'ready-only'} isowner={owner} userId={perm.userId._id} docIDD={docId}/>
              )) : (
                <motion.div 
                initial={{ scale: 0.2 }}
                animate={{ scale: 1 }}
                transition={{ ease: 'easeInOut', duration: 1 }}
                className="text-xs text-center opacity-70 p-2">
                  None!
                </motion.div>
              )
            }
          </motion.ul>
        </motion.div>
      </div>
    );
  };
  
  const Option = ({ text, Icon, isReadOnly, isowner, userId, docIDD }) => {
    const queryClient = useQueryClient();

    const handleRemoveAccess = async ({ usID, doID }) => {
      try {
        const response = await axios.patch(
          `/api/v1/document/removeAccess/${usID}/${doID}`,
          {},
          { withCredentials: true }
        );
    
        if (response.status === 200) {
          return response.data?.data; 
        } else {
          console.error(`Unexpected response status: ${response.status}`);
          throw new Error("Failed to remove access.");
        }
      } catch (error) {
        console.error("Error while removing access:", error.message);
        throw error; 
      }
    };

    const { mutate } = useMutation({
      mutationFn: handleRemoveAccess,
      onSuccess: (data) => {
        
        queryClient.setQueryData([`/editor/${docIDD}`], (oldData) => {
          if (!oldData) return oldData;
          const updatedPermissions = oldData.permissions.filter(
            (perm) => perm._id !== data.permissionId
          );

          return {
            ...oldData,
            permissions: updatedPermissions,
          };
        });
      },
      onError: (error) => {
        console.error("Error during mutation:", error.message);
      },
    });
    return (
      <motion.li
        variants={itemVariants}
        className="flex items-center gap-2 w-full p-2 px-3 text-xs font-medium whitespace-nowrap rounded-md hover:bg-golden/10 text-slate-700 hover:text-golden transition-colors cursor-pointer"
      >
        <motion.span variants={actionIconVariants} className="w-[10%]">
          <Icon />
        </motion.span>
        <span className="w-[80%] truncate">{text}</span>
        <span className="w-[10%]">{isReadOnly ? <IoReaderOutline/> : <CiEdit/>}</span>
        {isowner && <button className="hover:text-red-500 active:text-red-700 p-[0.12rem]" onClick={()=>{mutate({ usID: userId, doID: docIDD })}}> <RxCross2 /> </button>}
      </motion.li>
    );
  };
  
  export default AccessDropDown;
  
  const wrapperVariants = {
    open: {
      scaleY: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      scaleY: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
      },
    },
  };
  
  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };
  
  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      y: -15,
      transition: {
        when: "afterChildren",
      },
    },
  };
  
  const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
  };