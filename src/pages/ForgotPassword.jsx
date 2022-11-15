import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth';

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e){
    setEmail(e.target.value)
  }

  return (
    <div>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">Forgot Password</h1>
      <div className='flex flex-wrap items-center justify-center max-w-6xl mx-auto mt-5'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" alt="key logo" className='w-full rounded-2xl' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-10'>
          <form action="submit" >
            <input 
            type="text" 
            placeholder='Enter email' 
            id='email' 
            className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' 
            value={email} 
            onChange={onChange}/>

            <div className='mb-6 flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p>Don't have an account                 
                <Link to="/signup" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'> Register</Link>
              </p>
              <p>
                <Link to="/signin" className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>Sign in instead</Link>
              </p>
            </div>
          <button type="submit" className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Send reset password</button>
          <div className='flex items-center my-4 before:border-t before:flex-1  before:border-gray-300 after:border-t after:flex-1  after:border-gray-300'>
            <p className='text-center font-semibold mx-4'>OR</p>
          </div>
          <OAuth/>
          </form>
        </div>
      </div>
      </section>
    </div>
  )
}

export default ForgotPassword