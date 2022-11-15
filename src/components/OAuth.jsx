import React from 'react';
import {FcGoogle} from 'react-icons/fc';

function OAuth() {
  return (
    <button className='w-full bg-red-600 text-white py-3 px-5 text-sm uppercase rounded font-medium flex justify-center items-center hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg transition duration-150 ease-in-out'>
        <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>Continue with Google
    </button>
  )
}

export default OAuth