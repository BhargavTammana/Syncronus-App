import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs,TabsList,TabsTrigger,TabsContent } from '../../components/ui/tabs'
import { Input} from "@/components/ui/input"
import { Button } from '../../components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { SIGNUP_ROUTE,LOGIN_ROUTE } from '@/utils/constants'
import { apiClient } from '@/lib/api-client'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'


const Auth = () => {
    const navigate = useNavigate()
    const {setUserInfo} = useAppStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const validateSignup =()=>{
        if(!email.length){
            toast.error("Email is required")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false;
        }
        if(password!==confirmPassword){
            toast.error("Passwords do not match")
            return false
        }
        return true
    } 
    const validateLogin =()=>{
        if(!email.length){
            toast.error("Email is required")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false;
        }
        return true
    }  

    const handleLogin=async ()=>{
        try{
            if(validateLogin()){
                const res = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
                console.log(res.data.user)
                if(res.data.user.id){
                    setUserInfo(res.data.user);
                    
                    if(res.data.user.profileSetup)
                        navigate('/chat')
                    else{
                        
                        console.log(res.data.user);
                        navigate('/profile')
                    }
                }
                
            }
        }catch(err){
            if(err.status==401){
                console.log(err)
                toast.error("Invalid password")
            }
            if(err.response && err.response.status===404){
                toast.error("Invalid credentials")
            }
        }

    }
    const handleSignup=async ()=>{
        if(validateSignup()){
            const res = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true})
            if(res.status===201) {setUserInfo(res.data.user);navigate('/profile');}
        }
            
    }
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
            <div className="flex flex-col gap-10 items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center">
                        <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                        <img src={Victory} alt="Victory Emoji" className='h-[100px]'/>
                    </div>
                    <p className="font-medium text-center">Fill in the details to get started with the best chat app!</p>
                </div>
                <div className="flex items-center justify-center w-full">
                <Tabs className='w-3/4' defaultValue='login'>
                    <TabsList className="bg-transparent rounded-none w-full">
                        <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90  border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90  border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">SignUp</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex flex-col gap-5 mt-10"value="login">
                        <Input placeholder='Email' value={email} type='email' onChange={(e)=>{setEmail(e.target.value)}} className='rounded-full p-6'></Input>
                        <Input placeholder='Password' value={password} type='password' onChange={(e)=>{setPassword(e.target.value)}} className='rounded-full p-6'></Input>
                        <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                    </TabsContent>
                    <TabsContent className="flex flex-col gap-5"value="signup">
                        <Input placeholder='Email' value={email} type='email' onChange={(e)=>{setEmail(e.target.value)}} className='rounded-full p-6'></Input>
                        <Input placeholder='Password' value={password} type='password' onChange={(e)=>{setPassword(e.target.value)}} className='rounded-full p-6'></Input>
                        <Input placeholder='Confirm Password' value={confirmPassword} type='password' onChange={(e)=>{setConfirmPassword(e.target.value)}} className='rounded-full p-6'></Input>
                        <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
                    </TabsContent>
                </Tabs>

                   
                </div>
            </div>
            <div className="hidden xl:flex items-center justify-center">
                <img src={Background} alt="background login" className='h-[580px]' />
            </div>
        </div>
    </div>
  )
}

export default Auth