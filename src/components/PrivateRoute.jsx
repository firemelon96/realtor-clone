import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import {useAuthStatus} from '../hooks/useAuthStatus';
function PrivateRoute() {
  const {loggedIn, checkingStatus} = useAuthStatus();
  if(checkingStatus){
    return <p>Loading</p>
  }
  return loggedIn ? <Outlet/> : <Navigate to='/signin'/>
}

export default PrivateRoute