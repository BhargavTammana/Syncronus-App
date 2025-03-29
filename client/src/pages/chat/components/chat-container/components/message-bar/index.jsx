import {GrAttachment} from 'react-icons/gr'
import { useState,useRef, useEffect} from 'react'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useSocket } from '@/context/SocketContext'
import { useAppStore } from '@/store'
import { UPLOAD_FILE_ROUTE } from '@/utils/constants'
import { apiClient } from '@/lib/api-client'

const MessageBar = () => {
    const emojiRef = useRef()
    const fileInputRef = useRef()
    const socket = useSocket()
    const {selectedChatType,selectedChatData,userInfo,setIsUploading,setIsDownloading,setFileUploadProgress,setFileDownloadProgress}=useAppStore()
    const [emojiPickerOpen,setEmojiPickerOpen] = useState(false)
    const [message, setMessage] = useState("")


    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener('mousedown',handleClickOutside)
        return ()=>{
            document.removeEventListener('mousedown',handleClickOutside)
        }
    },[emojiRef])

    const handleAddEmoji =(emoji)=>{
        setMessage((msg)=>msg+emoji.emoji)
    }
    
    const handleSendMessage = async()=>{
        if(message.trim() === "") return;
        
        if(selectedChatType === "channel"){
            console.log("\n=== SENDING CHANNEL MESSAGE ===");
            console.log("Socket ID:", socket.id);
            console.log("Socket connected:", socket.connected);
            console.log("Message:", {
                channelId: selectedChatData._id,
                sender: userInfo.id,
                content: message,
                messageType: "text"
            });
            
            if (!socket) {
                console.error("Socket is not initialized!");
                return;
            }
            
            if (!socket.connected) {
                console.error("Socket is not connected!");
                return;
            }
            
            socket.emit("send-channel-message",{
                channelId: selectedChatData._id,
                sender: userInfo.id,
                content: message,
                messageType: "text"
            })
            console.log("Message emitted successfully");
            setMessage("")
        }
        else if(selectedChatType === 'contact'){
            socket.emit("sendMessage",{
                sender:userInfo.id,
                content:message,
                recipient:selectedChatData._id,
                messageType:"text",
                fileUrl:undefined
            })
            setMessage(""); // Clear the message input after sending
        }
    }

    const handleKeyPress = (e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleSendMessage();
        }
    }

    const handleAttachmentClick = ()=>{
        if(fileInputRef.current ){
            fileInputRef.current.click()
        }
    }

    const handleAttachmentChange = async(event)=>{
        try{
            const file = event.target.files[0]
            if(file){
                const formData = new FormData()
                formData.append("file",file)
                setIsUploading(true)
                
                const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials: true,onUploadProgress:(progressEvent)=>{
                    setFileUploadProgress(Math.round((progressEvent.loaded*100)/progressEvent.total))
                }})
                if(response.status === 200 && response.data){
                    setIsUploading(false)
                    if(selectedChatType==="contact"){
                        socket.emit("sendMessage",{
                            sender:userInfo.id,
                            content:undefined,
                            recipient:selectedChatData._id,
                            messageType:"file",
                            fileUrl:response.data.filePath
                        })
                    }  
                    else if(selectedChatType==="channel"){
                        socket.emit("send-channel-message",{
                            sender:userInfo.id,
                            content:undefined,
                            messageType:"file",
                            channelId:selectedChatData._id,
                            fileUrl:response.data.filePath
                        })
                    }
                }
            }
        }catch(err){
            setIsUploading(false)
            console.log({err})
        }
    }
  
    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input 
                    type="text" 
                    id="messageInput"
                    name="messageInput"
                    className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttachmentClick}>
                    <GrAttachment className="text-2xl"/>
                </button>
                <input type="file" className='hidden' ref = {fileInputRef} onChange={handleAttachmentChange}/>
                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    onClick={()=>setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-2xl"/>
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                        open={emojiPickerOpen}
                        onEmojiClick={handleAddEmoji}
                        autoFocusSearch={false}
                        theme='dark'/>
                    </div>
                </div>
            </div>
            <button 
                className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all" 
                onClick={handleSendMessage}>
                <IoSend className="text-2xl"/>
            </button>
        </div>
    )
}

export default MessageBar