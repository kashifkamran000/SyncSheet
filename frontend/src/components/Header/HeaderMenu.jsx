import React, { useEffect, useState } from "react";
import {
  FiChevronDown,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IoReaderOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { FiCheck } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { FaCode } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { MdOutlineEngineering } from "react-icons/md";

const HeaderMenu = () => {
  const [selected, setSelected] = useState(null);
  const [dir, setDir] = useState(null);

  const handleSetSelected = (val) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onClick={()=>(selected != null && setSelected(null))}
      className="relative flex h-fit gap-2 mr-3"
    >
      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected && <Content dir={dir} selected={selected} />}
      </AnimatePresence>
    </div>
  );
};

const Tab = ({ children, tab, handleSetSelected, selected }) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-light transition-colors border-[0.07rem] ${
        selected === tab
          ? "bg-white border-golden/40"
          : "bg-bg-main border-bg-main"
      }`}
    >
      <span>{children}</span>
      <FiChevronDown
        className={`transition-transform ${
          selected === tab ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

const Content = ({ selected, dir }) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className="absolute right-0 top-[calc(100%_+_24px)] w-[22rem] rounded-lg border-[0.07rem] border-golden/40 bg-gradient-to-b from-bg-main via-bg-main to-white p-3 z-30"
    >
      <Bridge />
      <Nub selected={selected} />

      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <t.Component />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

const Nub = ({ selected }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border-[0.07rem] border-golden/40 bg-bg-main"
    />
  );
};

const Navigation = () => {
  const userData = useSelector((state)=>state.auth.userData);
  return (
    <div className="grid grid-cols-3 gap-4 divide-x divide-neutral-700">
      <Link to={'/allDocuments'}>
        <div
          className="flex w-full flex-col items-center justify-center py-2 text-main-text/90 hover:text-main-text active:text-main-text/80 transition-colors "
        >
          <IoDocumentTextOutline className="mb-2 text-xl text-golden" />
          <span className="text-xs">All Docs</span>
        </div>    
      </Link>
      <Link to={`/profile/${userData?._id}`}>
        <div
          className="flex w-full flex-col items-center justify-center py-2 text-main-text/90 hover:text-main-text active:text-main-text/80 transition-colors "
        >
          <LuUser className="mb-2 text-xl text-golden" />
          <span className="text-xs truncate">{userData.username}</span>
        </div>    
      </Link>
      <a
        href="https://harshrana.in" target='_blank' rel="noopener noreferrer"
        className="flex w-full flex-col items-center justify-center py-2 text-main-text/90 hover:text-main-text active:text-main-text/80 transition-colors"
      >
        <MdOutlineEngineering className="mb-2 text-2xl text-golden" />
        <span className="text-xs">Developer</span>
      </a>
    </div>
  );
};

const Invitation = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {data: inviteData = [], isLoading, isError, error: inviteError} = useQuery({
        queryKey: ['invitations'],
        queryFn: async()=>{
            try {
              const response = await axios.get(`/api/v1/invitation/allInvite`, {
                  withCredentials: true
              })
      
              if(response.status===200){
                  return response.data?.data;
              }
  
              throw new Error('Failed to fetch invitations');
            } catch (error) {
              console.log(error);
              
            }
        }
      })

      const handleAcceptInvite = async(inviteId)=>{
        const response = await axios.patch(`/api/v1/invitation/acceptInvite/${inviteId}`, {
            withCredentials: true
        })

        if(response.status===200){
            return response.data?.data;
        }
        throw new Error('Failed to accept invitation');
      }

      const {mutate: mutateAccept} = useMutation({
        mutationFn: handleAcceptInvite,
        onSuccess: async(data)=>{
            setTimeout(() => {
              navigate(`/editor/${data.documentId}`)
            }, 800);
            queryClient.setQueryData(['invitations'], (oldData) => {
                return oldData.filter((oldInvite) => oldInvite._id !== data.documentId);
            });
        }
      })

      const handleRejectInvite = async({inviteID, ownerId})=>{
        const response = await axios.delete(`/api/v1/invitation/rejectInvite/${ownerId}/${inviteID}`, {withCredentials: true});

        if(response.status===200){
          return response.data?.data;
        }
        throw new Error('Failed to reject invitation');
      }

      const {mutate: mutateReject} = useMutation({
        mutationFn: handleRejectInvite,
        onSuccess: async(data)=>{
          queryClient.setQueriesData(['invitations'], (oldData=[])=>{
            return oldData.filter((old)=> old._id !== data.inviteId);
          })
        }
      })

      if (isLoading) {
        return <p>Loading...</p>;
      }
    
      if (isError) {
        return <p>Error: {inviteError.message}</p>;
      }
  return (
    <div>
      {
        inviteData?.length <= 0 ? (
            <>
                <div className="font-light text-main-text/70 text-center text-sm">
                    Empty !
                </div>
            </>
        ) : (
            <>
                <div>
                <div className="flex text-xs px-4 pt-2">
                     <p className="w-[34%] pr-2">
                         Doc Title
                      </p>
                     <p className="w-[25%] pr-2">
                         From
                     </p>
                     <p className="w-[19%] flex justify-center">
                          Access
                     </p>
                     <p className="w-[22%] flex justify-center">
                        Accept
                     </p>
                  </div>
                    {
                        inviteData?.map((invite)=>(
                            <div key={invite?._id} className="text-sm  p-2  ">
                                <div className="border-[0.07rem] border-bg-main p-2 hover:border-golden/40 transform transition-all duration-300 flex items-center rounded-lg font-extralight">
                                    
                                    <p className="text-sm w-[34%]  truncate pr-2">
                                        {invite?.documentId.title}
                                    </p>
                                    <p className="text-sm w-[25%] truncate pr-2">
                                        {invite?.documentId.owner.fullName}
                                        <p className="text-xs truncate">
                                            @{invite?.documentId.owner.username}
                                        </p>
                                    </p>
                                    <p className="flex justify-center items-center w-[19%] overflow-hidden">
                                        {invite?.permission==='read-only' ? <IoReaderOutline/> : <CiEdit/>}
                                    </p>
                                    <div className="w-[22%] px-2">
                                        <div className="w-full flex justify-around">
                                            <div
                                            onClick={()=>mutateAccept(invite?._id)} 
                                            className="hover:bg-green-700/10 p-1 rounded-full hover:text-green-700 transition-colors duration-300">
                                                <FiCheck />
                                            </div>
                                            <div
                                            onClick={()=>mutateReject({inviteID: invite?._id,ownerId: invite?.documentId.owner._id})} 
                                            className="p-1 rounded-full hover:text-red-700 hover:bg-red-700/10 transition-colors duration-300">
                                                <RxCross2 />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            </>
        )
      }
    </div>
  );
};

const TABS = [
  {
    title: "Navigation",
    Component: Navigation,
  },
  {
    title: "Invitations",
    Component: Invitation,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));


export default HeaderMenu;