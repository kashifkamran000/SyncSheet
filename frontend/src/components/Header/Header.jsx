import React from 'react'
import Logo from '../utils/Logo'
import LogoutBtn from './LogoutBtn'
import HeaderMenu from './HeaderMenu'
import { useSelector, } from 'react-redux'
import LoginButton from '../utils/LoginButton'
import SignUpButton from '../utils/SignUpButton'

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
 
  return (
    <div className='border-b-2 px-8 flex py-4 justify-between '>
      <Logo/>
      { 
        authStatus ? (
          <div className='flex items-center font-light'>
          <HeaderMenu/>
          <LogoutBtn/>
          .</div>
        ) : (
          <div className='flex'>
            <SignUpButton/>
            <LoginButton/>
          </div>
        )
       
      }
      
    </div>
  )
}

export default Header