import {Server as SocketIoServer} from "socket.io"
import Message from "./models/MessagesModel.js"

const setupSocket = (server)=>{
    const io = new SocketIoServer(server,{
        cors:{
            origin: process.env.ORIGIN,
            methods:['GET','POST'],
            credentials:true
        }
    })

    const userSocketMap = new Map()

    const disconnect = (socket)=>{
        console.log(`Client Disconnected: ${socket.id}`);
        for(const [userID,socketId] of userSocketMap.entries()){
            if(socketId == socket.id){
                userSocketMap.delete(userID)
                break;
            }
        }
    }
    const sendMessage = async(message)=>{
        try {
            // Validate message data
            if (message.messageType === "text" && (!message.content || message.content.trim() === "")) {
                console.error("Message content is required for text messages");
                return;
            }
            
            if (message.messageType === "file" && (!message.fileUrl || message.fileUrl.trim() === "")) {
                console.error("File URL is required for file messages");
                return;
            }
            
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            const createdMessage = await Message.create(message)

            const messageData = await Message.findById(createdMessage._id)
            .populate("sender","id email firstName lastName image color")
            .populate("recipient","id email firstName lastName image color")
            
            if(recipientSocketId){
                io.to(recipientSocketId).emit("receiveMessage",messageData)
            }
            if(senderSocketId){
                io.to(senderSocketId).emit("receiveMessage",messageData)
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId

        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User Connected: ${userId} with socketID: ${socket.id}`);
        }else{
            console.log("User ID not provided during connection")
        }
        socket.on("sendMessage",sendMessage)
        socket.on("disconnect",()=>disconnect(socket))
    })
}

export default setupSocket;