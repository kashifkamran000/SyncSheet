import React, { useState, useEffect } from 'react'
import image from '../../assets/loginPagImage.jpg'
import {motion} from 'framer-motion'
import Logo from '../utils/Logo'
import { useForm } from 'react-hook-form'
import Input from '../utils/Input'
import { Link, useNavigate } from 'react-router-dom'
import FactImage from '../utils/factImage'
import axios from 'axios'
import qs from 'qs'
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'
import {login} from '../../store/authStore'
import LoginSignupBtn from '../utils/LoginSignupBtn.jsx'
import GoogleLoginSignup from './GoogleLoginSignup.jsx'


const handleLogin = async (data)=>{

  const formData = qs.stringify({
    username: data.usernameOrEmail.includes('@') ? undefined : data.usernameOrEmail,
    email: data.usernameOrEmail.includes('@') ? data.usernameOrEmail : undefined,
    password: data.password,
  }); 

  try {
    const response = await axios.post('/api/v1/user/login', formData, {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true
    }) 

    if(response.status === 200){
      return response?.data?.data;
    }
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
  }
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const [hidePassword, setHidePassword] = useState(true);
  
  const { mutate } = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data)=>{
      reset();
      dispatch(login(data));
      navigate('/');
    },
    onError: (error)=>{
      console.error('Login Failed: ', error);
      
    }
  })
 
  return (
    <div className='m-3 flex flex-col lg:flex-row text-main-text'>
      {/* Image Section */}
      <FactImage img={image}/>
      {/* Form Section */}
      <div className='flex justify-center items-center w-full lg:w-2/3'>
        <div className='grid place-content-center w-full max-w-md'>
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
          <div className='border-[0.01rem] p-7 rounded-xl shadow-lg overflow-hidden relative bg-gradient-to-br from-white from-30% to-golden/40'>
            <div className='w-[20rem] h-[20rem] absolute rounded-full bg-gradient-to-br from-golden/70 z-10 -top-32 -left-32'></div>
            <div className='relative z-20'>
              <div className='text-center text-xl font-light text-main-text mb-7 mt-3'>
                Welcome Back User!
              </div>
              <form onSubmit={handleSubmit((data)=>mutate(data))}>
                <Input
                  label="Username or Email"
                  {...register("usernameOrEmail", { required: 'Username or Email is required' })}
                  error={errors.usernameOrEmail?.message}
                />
                <div className='relative'>
                  <Input
                    label="Password"
                    type={hidePassword ? 'password' : 'text'}
                    {...register("password", { required: 'Password is required' })}
                    error={errors.password?.message}
                  />
                  <span onClick={() => setHidePassword(!hidePassword)} className='absolute right-4 top-12'>
                    {hidePassword ? <i className="fa-regular fa-eye-slash text-main-text"></i> : <i className="fa-regular fa-eye text-golden"></i>}
                  </span>
                </div>
                <div className='flex justify-between items-end mt-6'>
                  <div className='mb-6'>
                    <LoginSignupBtn children='Login'/>
                  </div>
                  <div>
                    <Link to='/signup'>
                      <div className='text-sm font-light text-golden cursor-pointer hover:underline'>
                        New User? Please SignUp
                      </div>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            <GoogleLoginSignup/>
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default Login