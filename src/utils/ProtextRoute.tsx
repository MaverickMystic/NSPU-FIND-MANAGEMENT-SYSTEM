import React, { JSX, useEffect } from 'react'
import { useAuthContext } from './AuthContext'
import { Navigate } from 'react-router-dom';

function ProtextRoute({children}:{children:React.ReactNode}) {
    useEffect(()=>{
console.log('protext route')
    },[])
    const {user,isloading}=useAuthContext();
    if(isloading) return <div>...loading</div>
    if(!user) return <Navigate to='/login' replace/>
  return (
   <>{children}</>
  )
}

export default ProtextRoute