import React from 'react'
import { persistor } from '../../store/store.js'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authStore.js'
import {motion} from 'framer-motion'


const handleLogout = async () =>{
    const response = await axios.get('/api/v1/user/logout', {
        withCredentials: true
    })

    if(response.status === 200){
        return 1;
    }
}

function LogoutBtn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { mutate, isLoading } = useMutation({
        mutationFn: handleLogout,
        onSuccess: (data) => {
            if(data === 1) {
                dispatch(logout());
                localStorage.clear();
                persistor.purge();
                navigate('/login');
            }
        },
        onError: (error) => {
            console.error("Error during logout:", error);
        }
    });

  return (
    <div>
        <motion.button
        initial={{scale: 1}}
        whileHover={{scale: 1.03}}
        whileTap={{scale: 0.95}}
        type='submit'
        className='text-white font-light bg-golden text-sm px-6 py-2 rounded-full'
        onClick={()=>mutate()}
        disabled={isLoading}
        >
            {isLoading ? 'Logging out...' : 'Logout'} <i className="fa-solid fa-arrow-right-from-bracket ml-1"></i>
        </motion.button>
    </div>
  )
}

export default LogoutBtn