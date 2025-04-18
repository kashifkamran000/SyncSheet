import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Input from '../utils/Input';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { GrUserAdmin } from "react-icons/gr";
import { IoReaderOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import LoadingCircular from '../utils/Loading/LoadingCircular';
import Error from '../utils/Error';

function AllDocument() {
  const [createFrom, setCreateForm] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.auth.userData);

  //get all docs using react query
  const { data: documents = [], isError, isLoading, error } = useQuery({
    queryKey: ['allDocuments'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/v1/document/getAllDocs', {
          withCredentials: true
        });

        return response.data?.data || [];
      } catch (err) {
        console.error('Error fetching documents:', err);
        throw err;
      }
    }
  });

  //create doc function
  const createDoc = async (formData) => {
    try {
      const payload = formData.title ? qs.stringify({ title: formData.title }) : null;
      
      const response = await axios.post('/api/v1/document/createDoc', payload, {
        headers: {
          'Content-Type': payload ? 'application/x-www-form-urlencoded' : undefined
        },
        withCredentials: true
      });

      if (response.status === 200) {
        return response.data?.data;
      }
      throw new Error('Failed to create document');
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  //mutate new data using RQ
  const { mutate } = useMutation({
    mutationFn: createDoc,
    onSuccess: (newData) => {
      queryClient.setQueryData(['allDocuments'], (oldData = []) => {
        return [...oldData, newData];
      });
      reset();
      setCreateForm(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const getDocumentAccessIcon = (doc, userId) => {
    if (!doc || !userId) return <IoReaderOutline />;

    // Check if user is owner
    if (doc?.owner?._id === userId) {
      return <GrUserAdmin />;
    }

    // Check user permissions
    try {
      const userPermission = doc.permissions?.find(perm => perm?.userId === userId);
      if (userPermission?.permission === 'read-write') {
        return <CiEdit />;
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }

    // Default to read-only
    return <IoReaderOutline />;
  };

  // Filter documents based on title search
  const filteredDocuments = documents.filter(doc => {
    const docTitle = doc?.title?.toLowerCase() || 'untitled document';
    return docTitle.includes(searchTitle.toLowerCase());
  });

  if (isLoading) {
    return <LoadingCircular w={400} h={400}/>
  }

  if (isError) {
    return <Error message={error.message}/>
  }

  return (
    <div className='text-main-text flex justify-center p-7'>
      <div className='w-[65rem]'>
        <h3 className='text-2xl font-extralight mb-4'>
          All Documents:
        </h3>
        <div className="relative mb-6">
          <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className=" pl-10 w-full pr-4 py-2 border border-black/30 rounded-lg focus:outline-none focus:border-[#b8860b]"
          />
        </div>
        <div className='flex flex-wrap my-7'>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            exit={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateForm(true)}
            className='w-[15rem] h-[4rem] my-2 mx-2 border-[0.04rem] rounded-lg text-base border-black/30 flex items-center font-light cursor-pointer bg-gradient-to-b from-bg-main via-bg-main to-white'>
            <i className="fa-solid fa-plus px-3 ml-2"></i> Create New
          </motion.div>
          {filteredDocuments.map((doc) => (
            <Link key={doc?._id} to={`/editor/${doc?._id}`}>
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05}}
                whileTap={{ scale: 1 }}
                exit={{ scale: 1 }}
                className='w-[15rem] h-[4rem] border-[0.01rem] relative rounded-lg border-black/20 flex items-center justify-between font-light text-main-text my-2 mx-2 p-4 overflow-hidden text-sm'>
                {!doc ? (
                    <span className="animate-pulse">Loading...</span>
                ) : (
                    <>
                        <div className='mx-1'>
                            <div className="truncate w-full" title={doc?.title || 'Untitled Document'}>
                                {doc?.title || 'Untitled Document'}
                            </div>
                            <div className="truncate w-full text-[0.6rem] opacity-70" title={doc?.owner.username}>
                               @ {doc?.owner.username}
                            </div>
                        </div>
                        <span>{getDocumentAccessIcon(doc, currentUser?._id)}</span>
                    </>
                )}
              </motion.div>
            </Link>
          ))}
          {filteredDocuments.length === 0 && searchTitle && (
            <div className="w-full text-center text-gray-500 mt-4">
              No documents found with title matching "{searchTitle}"
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {createFrom && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateForm(false)}
          >
            <motion.div
              className="bg-bg-main p-8 rounded-lg w-[30rem]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit((data) => mutate(data))}>
                <Input
                  label='Title :'
                  {...register("title", { required: false })}
                />
                <div className='w-full flex justify-end mt-7'>
                  <motion.button
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    type='submit'
                    className='text-white font-light bg-[#b8860b] text-sm px-6 py-2 rounded-full flex justify-center items-center'
                  >
                    <i className="fa-solid fa-plus pr-2"></i> Create New
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AllDocument;