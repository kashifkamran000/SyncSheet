import React from 'react'
import Lottie from 'lottie-react'
import animation from '../../../assets/PageNotFound.json'

function PageNotFound() {
  return (
    <div className='flex justify-center items-center top-0 z-50 w-full h-[37rem] bg-hopbush-900/10'>
      <Lottie 
        animationData={animation} 
        loop={true}
        autoplay={true}
        style={{ width: 600, height: 600 }}
      />
    </div>
  )
}

export default PageNotFound