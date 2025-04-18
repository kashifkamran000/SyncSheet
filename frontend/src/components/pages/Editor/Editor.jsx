import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useRef, forwardRef } from 'react';
import DocPermission from './DocPermission';
import AccessDropDown from './AccessDropDown'
import InviteButton from './InviteButton';
import {Link} from 'react-router-dom'
import Errorr from '../../utils/Error';
import LoadingCircular from '../../utils/Loading/LoadingCircular';
import ChatBot from './ChatBot';

//custom quill editor
const CustomQuill = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

const Editor = () => {
  const [content, setContent] = useState('');
  const { docID } = useParams();
  const [deleteConf, setdeleteConf] = useState(false);
  const navigate = useNavigate();
  const [deleteStatus, setDeleleteStatus] = useState(false);
  const [deleteSuccess, setDeleleteSuccess] = useState(false);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.userData);
  const [socketError, setSocketError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const lastUpdateRef = useRef(null);
  

  //fetching initial data 
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`/editor/${docID}`],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/document/openDoc/${docID}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        return response.data?.data;
      } else {
        throw new Error('Failed to fetch document');
      }
    }
  });

  //setting content in quill
  useEffect(() => {
    if (data && data.content && data.content !== content) {
      setContent(data.content);
    }
  }, [data?.content]);

  //scoket.io initialisation and functionality
  useEffect(() => {
    const initialiseSocket = () => {
      try {
        const socketUrl = import.meta.env.VITE_SERVER_URL;
        
        socketRef.current = io(socketUrl, {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true,
          timeout: 10000
        });

        socketRef.current.on('connect', () => {
          console.log('Socket connected:', socketRef.current.id);
          setIsConnected(true);
          setSocketError(null);
          socketRef.current.emit('joinDocument', docID);
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setSocketError('Failed to connect to server');
          setIsConnected(false);
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
        });

        socketRef.current.on('text-change', ({ delta, editorName, content: newContent }) => {
          if (editorRef.current) {
            const editor = editorRef.current.getEditor();
            
            // Only apply changes if they're newer than our last update
            if (!lastUpdateRef.current || Date.now() - lastUpdateRef.current > 10) {
              requestAnimationFrame(() => {
                editor.updateContents(delta);
                setContent(newContent);
              });
              lastUpdateRef.current = Date.now();
            }
          }
        });

        socketRef.current.on('error', (message) => {
          console.error('Socket error:', message);
          setSocketError(message);
          // Clear error after 5 seconds
          setTimeout(() => setSocketError(null), 5000);
        });

        socketRef.current.on('update-error', (error) => {
          console.error('Document update error:', error);
          setUpdateError(error);
          // Clear error after 5 seconds
          setTimeout(() => setUpdateError(null), 5000);
        });

        socketRef.current.on('update-success', () => {
          setUpdateError(null);
        });

      } catch (err) {
        console.error('Socket initialization error:', err);
        setSocketError('Failed to initialize socket connection');
      }
    };

    initialiseSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('text-change');
        socketRef.current.off('error');
        socketRef.current.off('update-error');
        socketRef.current.off('update-success');
        socketRef.current.disconnect();
      }
    };
  }, [docID]);

  const isReadWrite = useMemo(() => (
    currentUser._id === data?.owner?._id || 
    data?.permissions?.some((perm) => 
      perm.userId._id === currentUser._id && perm.permission === 'read-write')
  ), [currentUser._id, data?.owner?._id, data?.permissions]);

  // Debounce function to prevent too frequent updates
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleTextChange = useCallback(debounce((value, delta, source) => {
    if (isReadWrite && source === 'user' && socketRef.current?.connected) {
      lastUpdateRef.current = Date.now();
  
      const editor = editorRef.current?.getEditor();
      const selection = editor.getSelection(true);
  
      // Save cursor position before applying the change
      const currentPosition = selection ? selection.index : 0;
  
      try {
        socketRef.current.emit('text-change', {
          documentId: docID,
          delta,
          userId: currentUser._id,
          content: value,
        }, (acknowledgement) => {
          if (acknowledgement?.error) {
            setUpdateError(acknowledgement.error);
          } else {
            setContent(value);
            setUpdateError(null);
  
            // Apply delta after content update to avoid losing cursor position
            editor.updateContents(delta);
  
            // Restore selection after update
            if (selection) {
              editor.setSelection(currentPosition, selection.length);
            }
          }
        });
      } catch (err) {
        console.error('Error emitting text change:', err);
        setUpdateError('Failed to send update to server');
      }
    }
  }, 300), [isReadWrite, docID, currentUser?._id]);
  
  
  const handleDocDelete = async () => {
    setDeleleteStatus(true);
    try {
      const response = await axios.delete(`/api/v1/document/deleteDoc/${data._id}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setDeleleteSuccess(true);
        setTimeout(() => {
          navigate('/allDocuments');
        }, 2000);
      }
    } catch (error) {
      setDeleleteStatus(false);
      console.error('Error deleting document:', error);
    }
  };

  const renderConnectionStatus = () => {
    if (socketError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
          Connection Error: {socketError}
        </div>
      );
    }
    if (updateError) {
      return (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-2 rounded-md mb-4">
          Update Error: {updateError}
        </div>
      );
    }
    if (!isConnected) {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-md mb-4">
          Connecting to server...
        </div>
      );
    }
    return null;
  };


  const modules = useMemo(()=>({
    toolbar: isReadWrite
    ? [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [
          { 'list': 'ordered' },
          { 'list': 'bullet' },
          { 'indent': '-1' },
          { 'indent': '+1' },
        ],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ]
    : null,
    clipboard: {
      matchVisual: false,
    }
  }), [isReadWrite])

  const formats = useMemo(()=>([
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ]))

  if(isLoading){
    return <LoadingCircular/>
  }

  if(isError){
    return <Errorr message={error.message}/>
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <ChatBot/>
      <div className="font-light flex items-center justify-between">
        <div className='text-2xl font-extralight pl-3'>
          {data?.title}
        </div>
        <div className='flex space-x-3 p-5 items-center'>
          <div className='relative flex items-center space-x-6'>
            {currentUser._id === data?.owner?._id && <InviteButton docId={data?._id}/>}
            <AccessDropDown permissions={data?.permissions} owner={currentUser._id === data?.owner?._id} docId={docID}/>
          </div>
          <Link to={`/profile/${data?.owner._id}`} className='flex'>
            <img
              src={data?.owner?.avatar}
              alt={`${data?.owner?.fullName}'s avatar`}
              className="w-10 h-10 rounded-full object-cover shadow-inner mr-2"
            />
            <div className='pr-4'>
              <div className="text-gray-800">
                @{data?.owner?.fullName}
              </div>
              <div className="text-gray-500 text-xs">
                {data?.createdAt.slice(0, 10)}
              </div>
            </div>
          </Link>
          
          <div>
            <i className="fa-regular fa-trash-can text-xl p-1 opacity-70 hover:text-red-500 active:text-red-700" onClick={()=>setdeleteConf(true)}></i>
          </div>
        </div>
      </div>
      {renderConnectionStatus()}
      <CustomQuill
        ref={editorRef}
        theme="snow"
        modules={modules}
        formats={formats}
        readOnly={!isReadWrite}
        value={content}
        onChange={handleTextChange}
        className="bg-white rounded-lg shadow-md editor-container"
      />

      <style>{`
        .editor-container .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #e5e7eb;
          background-color: #f3f4f6;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 16px;
          padding: 12px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          flex-wrap: wrap;
          cursor: ${isReadWrite ? 'not-allowed' : 'text'};
          user-select: ${isReadWrite ? 'none' : 'auto'};
          pointer-events: ${isReadWrite ? 'none' : 'auto'};
        }
        .editor-container .ql-toolbar .ql-formats {
          display: flex;
          align-items: center;
          margin-right: 15px;
          margin-bottom: 5px;
        }
        .editor-container .ql-toolbar .ql-picker {
          font-weight: 350;
          font-size: 16px;
        }
        .editor-container .ql-toolbar .ql-picker-label {
          padding: 0 0 12px 0;
          margin: 0 0 0 10px;
        }
        .editor-container .ql-toolbar button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 2px;
        }
        .editor-container .ql-toolbar button svg {
          width: 20px;
          height: 20px;
        }
        .editor-container .ql-toolbar .ql-stroke {
          stroke-width: 1.5px;
        }
        .editor-container .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb;
          min-height: 10rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          padding: 1rem;
        }
        .editor-container .ql-editor {
          font-size: 1rem;
          line-height: 1.5rem;
        }
      `}</style>


      {/* Delete Confirmation*/}
      <AnimatePresence>
          {deleteConf && (
              <motion.div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setdeleteConf(false)}
              >
                  <motion.div
                      className="bg-bg-main p-8 rounded-xl w-[30rem]"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={(e) => e.stopPropagation()}
                  >
                    <div className='font-light flex justify-around items-center'>
                      Are you sure? 
                      <motion.button 
                      initial={{x: 20}}
                      animate={{x: deleteStatus ? 150 : 20}}
                      transition={{duration: 0.3, delay: 0.4}}
                        className="hover:text-red-700 flex items-center justify-center hover:bg-red-700/10 px-3 py-2 rounded-xl transition-colors ease-in-out duration-[500ms] overflow-hidden"
                        onClick={handleDocDelete}
                        disabled={deleteStatus}
                      >
                        {deleteSuccess ? (
                          <div className="w-5 flex justify-start items-center overflow-hidden">
                            <motion.div 
                              initial={{ width: 0, y: 20 }}
                              animate={{ 
                                width: deleteSuccess ? 'auto' : 0, 
                                y: deleteSuccess ? 0 : 20  
                              }}
                              transition={{ duration: 0.5, ease: 'linear' }}
                              className="overflow-hidden"
                            >
                              <i className="fa-solid fa-check"></i>
                            </motion.div>
                          </div>
                        ) : (
                          <>
                            Yes
                            {deleteStatus ? (
                              <motion.i 
                                initial={{ scale: 0.2 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  duration: 0.8, 
                                  ease: "easeInOut", 
                                  repeat: Infinity, 
                                  repeatType: "reverse" 
                                }}
                                className="fa-solid fa-circle ml-3"
                              />
                            ) : (
                              <i className="uil uil-trash-alt pl-2 text-lg"></i>
                            )}
                          </>
                        )}
                      </motion.button>
                      <motion.button 
                      initial={{ opacity: 1, visibility: 'visible' }}  
                      animate={{ 
                        opacity: deleteStatus ? 0 : 1, 
                        visibility: deleteStatus ? 'hidden' : 'visible'  }}
                      className='hover:text-green-700 hover:bg-green-700/10 px-3 py-2 rounded-xl transition-colors ease-in-out duration-[500ms]' 
                      onClick={()=>setdeleteConf(false)}
                      disabled={deleteStatus}>
                        Cancel <i className="pl-2 fa-solid fa-xmark"></i>
                      </motion.button>
                    </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>  

       {/* Invite Window*/}

   
    
       
    </div>
  );
};

export default Editor;