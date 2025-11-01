import React from 'react'
import {Link} from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Dnavbar = () => {
  return (
    <div className='flex items-center  justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300
    '>
        <Link to={`/`}>
        <h2 className='text-2xl font-bold text-sky-600'>Boni Amin</h2>
          {/* <img src={assets.logo} alt="" /> */}
        </Link>
        <UserButton/>
    </div>
  )
}

export default Dnavbar