import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = function(path){
        if(path === location.pathname){
            return true
        }
    }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3'>
            <div>
                <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" className='h-5 cursor-pointer' onClick={()=> navigate(`/`)} />
            </div>
            <div>
                <ul className='flex space-x-5'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${path(`/`) && `text-black border-b-red-500`}`} onClick={()=>navigate(`/`)}>Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${path(`/offers`) && `text-black border-b-red-500`}`} onClick={()=>navigate(`/offers`)}>Offers</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${path(`/signin`) && `text-black border-b-red-500`}`} onClick={()=>navigate(`/signin`)}>Sign in</li>
                </ul>
            </div>
        </header>
    </div>
  )
}

export default Header