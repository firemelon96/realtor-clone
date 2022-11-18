import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import {FcGoogle} from 'react-icons/fc';
import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {useNavigate} from 'react-router-dom';

function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick(){
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user;

      //check for the user if exist
      const docRef = doc(db, "users", user.uid)

      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()){
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }
      navigate('/');

    } catch (error) {
      toast.error('Could not authorize with google');
      console.log(error)
    }
  }
  return (
    <button type='button' onClick={onGoogleClick} className='w-full bg-red-600 text-white py-3 px-5 text-sm uppercase rounded font-medium flex justify-center items-center hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg transition duration-150 ease-in-out'>
        <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>Continue with Google
    </button>
  )
}

export default OAuth