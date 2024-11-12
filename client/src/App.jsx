import React, { useState } from 'react'
import {Button} from './components/ui/button'
import { BrowserRouter, Routes,Route,Navigate} from 'react-router-dom'
import Auth from './pages/auth'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { useAppStore } from './store'
import { useEffect } from'react'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
function App() {
  const PrivateRoute = ({children})=>{
    const {userInfo}=useAppStore()
    const isAuthenticated = !!userInfo
    return isAuthenticated ?children : <Navigate to="/auth"/>
  }

  const AuthRoute = ({children})=>{
    const {userInfo}=useAppStore()
    const isAuthenticated = !!userInfo
    return isAuthenticated ?<Navigate to="/chat"/>:children
  }
  const {userInfo,setUserInfo} = useAppStore()
  const [loading,setLoading]= useState(true)
  useEffect(()=>{
    const getUserData = async()=>{
      try{
        const res = await apiClient.get(GET_USER_INFO,{withCredentials:true})
        if(res.status===200 && res.data.id){
          setUserInfo(res.data)
        }else{
          setUserInfo(undefined)
        }
      }catch(err){
        setUserInfo(undefined)
      }finally{
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }else{
      setLoading(false)
    }
  },[userInfo,setUserInfo])

  if(loading){
    return <div>Loading...</div>
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
            // <AuthRoute>
              <Auth/>
            // </AuthRoute>
            }/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/chat" element={
            // <PrivateRoute>
              <Chat/>
            // </PrivateRoute> 
          }/>
          <Route path="*" element={<Navigate to ="/auth"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App