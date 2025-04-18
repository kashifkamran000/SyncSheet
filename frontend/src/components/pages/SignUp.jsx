import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import Logo from '../utils/Logo'
import { useForm } from 'react-hook-form'
import Input from '../utils/Input'
import { Link } from 'react-router-dom'
import image from '../../assets/signupPageImage.jpg'
import FactImage from '../utils/factImage'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {login} from '../../store/authStore.js'
import GoogleLoginSignup from './GoogleLoginSignup.jsx'


const handleSignup = async (data)=>{
  const formData = new FormData();

  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('avatar', data.avatar[0]);

    const response = await axios.post('/api/v1/user/register', formData, {
      headers: {
        'Content-Type' : 'multipart/form-data',         }
    })
    if(response.status === 200){
      return response?.data?.data;
    }
};

function SignUp() {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const [hidePassword, setHidePassword] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: handleSignup,
    onSuccess: (data) => {
      if (data) {
        console.log('Received signup data:', data); // Check if data is received properly
        dispatch(login(data));  // Ensure dispatch only happens when data is available
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('Signup error:', error);
      console.error('Response data:', error.response?.data);
    }
  })
  
  const onSubmit = (data) => {
    mutate(data);
  };

  console.log('isLoading state:', isLoading);

  useEffect(() => {
    console.log('Updated userData from Redux:', userData);
  }, [userData]); 

  return (
    <div className='m-3 flex flex-col lg:flex-row text-main-text justify-center'>
      {/* Loader */}
      {
        isLoading && 
        <div className='fixed top-0 left-0 w-svh h-svh bg-black/30 flex justify-center items-center z-30'>
            <div className='text-5xl'>
              Loading
            </div>
        </div>
      }
      {/* Form Section */}
      <div className='flex justify-center items-center w-full lg:w-2/3'>
        <div className='grid place-content-center w-4/5'>
          {/* Logo */}
          <motion.div
            animate={{ y: [0, -10, 0] }} 
            transition={{
              duration: 3,
              ease: 'easeInOut', 
              repeat: Infinity, 
              repeatType: 'loop', 
            }}
            style={{textAlign: 'center'}}
          >
          <Logo animate={false} size='text-4xl' className='mb-7'/>
          </motion.div>
          
          {/* Form Container */}
          <div className='border-[0.01rem] p-7 rounded-xl shadow-lg overflow-hidden relative bg-gradient-to-bl from-white from-30% to-golden/40'>
            <div className='w-[25rem] h-[25rem] absolute rounded-full bg-gradient-to-bl from-golden/60 from-5% to-white z-10 -top-16 -right-48'></div>
              <div className='relative z-20'>
              <div className='text-center text-xl font-light text-main-text mb-9 mt-3'>
                Welcome User!
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className=''>
                      <Input
                        label="Full Name"
                        {...register("fullName", { required: 'Full Name is required' })}
                        error={errors.fullName?.message}
                      />
                      <Input
                        label="Username"
                        {...register("username", { required: 'Username is required' })}
                        error={errors.username?.message}
                      />
                    </div>
                    <div>  
                      <Input
                        label="Email"
                        type='email'
                        {...register("email", { required: 'Email is required' })}
                        error={errors.email?.message}
                      />
                      <div className='relative'>
                      <Input
                        label="Password"
                        type={!hidePassword && 'password'}
                        {...register("password", { required: 'Password is required' })}
                        error={errors.password?.message}
                      />
                      <span onClick={()=>setHidePassword(!hidePassword)} className='absolute right-4 top-12'>
                        {hidePassword ? <i className="fa-regular fa-eye text-golden"></i> : <i className="fa-regular fa-eye-slash text-main-text"></i>}
                      </span>
                    </div>
                    </div>
                    <div className='col-span-2'>
                      <Input
                        type='file'
                        label="Avatar"
                        accept='image/*'
                        {...register("avatar", { required: 'Avatar is required' })}
                        error={errors.avatar?.message}
                      />
                    </div>
                  </div>
                  
                  {/* Login Button and SignUp Link */}
                  <div className='flex justify-between items-end mt-6'>
                    <motion.button
                    disabled={isLoading ? true : false}
                    initial={{scale: 1}}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.95}}
                    type='submit' className='text-white font-light bg-golden text-sm px-6 py-2 rounded-full'>
                      {isLoading ? 'Signing Up...' : 'SignUp'}<i className="fa-solid fa-arrow-right-to-bracket ml-1"></i>
                    </motion.button>
                    <Link to='/login'>
                      <div className='text-sm font-light text-golden cursor-pointer hover:underline '>
                        Old User? Please Login
                      </div>
                    </Link>
                  </div>
                </form>
              </div>
              <GoogleLoginSignup/>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <FactImage img={image}/>
  
      
    </div>
  )
}

export default SignUp