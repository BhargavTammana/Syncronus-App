import {Server as SocketIoServer} from "socket.io"
import Message from "./models/MessagesModel.js"
import Channel from "./models/ChannelModel.js"
const setupSocket = (server)=>{
    const io = new SocketIoServer(server,{
        cors:{
            origin: [
                "https://syncronus-app-frontend.onrender.com",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
            ],
            methods:['GET','POST'],
            credentials:true
        }
    })

    const userSocketMap = new Map()

    const disconnect = (socket)=>{
        for(const [userID,socketId] of userSocketMap.entries()){
            if(socketId == socket.id){
                userSocketMap.delete(userID)
                break;
            }
        }
    }
    const sendMessage = async(message)=>{
        try {
            if (message.messageType === "text" && (!message.content || message.content.trim() === "")) {
                return;
            }
            
            if (message.messageType === "file" && (!message.fileUrl || message.fileUrl.trim() === "")) {
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

    // Modify the sendChannelMessage function to bind to socket
    const sendChannelMessage = async function(message) {
        try {
            const {channelId, sender, content, messageType, fileUrl} = message
            
            if (messageType === "text" && (!content || content.trim() === "")) {
                return;
            }
            
            if (messageType === "file" && (!fileUrl || fileUrl.trim() === "")) {
                return;
            }

            // Create message
            const messageToCreate = {
                sender,
                recipient: null,
                content,
                messageType,
                fileUrl,
                timeStamp: new Date()
            }

            const createdMessage = await Message.create(messageToCreate)

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .exec()

            // Update channel
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createdMessage._id }
            })

            const channel = await Channel.findById(channelId).populate("members")
            
            const finalData = {
                ...messageData._doc,
                channelId: channel._id
            }

            // Emit to sockets
            if(channel && channel.members){
                const adminSocketId = userSocketMap.get(channel.admin._id.toString())
                
                if(adminSocketId){
                    io.to(adminSocketId).emit("receive-channel-message",finalData)
                }
                
                channel.members.forEach(member=>{
                    if(member._id.toString() === channel.admin._id.toString()) return
                    
                    const memberSocketId = userSocketMap.get(member._id.toString())
                    
                    if(memberSocketId){
                        io.to(memberSocketId).emit('receive-channel-message',finalData)
                    }
                })
            }
            
        } catch (error) {
            console.error("Error in sendChannelMessage:", error);
            console.error("Message data:", message);
        }
    }

    // Connection handler
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId) {
            userSocketMap.set(userId, socket.id);
            
            socket.on("send-channel-message", async (message) => {
                try {
                    const {channelId, sender, content, messageType, fileUrl} = message;
                    
                    const messageToCreate = {
                        sender,
                        recipient: null,
                        content,
                        messageType,
                        fileUrl,
                        timeStamp: new Date()
                    }
                    
                    const createdMessage = await Message.create(messageToCreate);
                    const messageData = await Message.findById(createdMessage._id)
                        .populate("sender", "id email firstName lastName image color")
                        .exec();

                    await Channel.findByIdAndUpdate(channelId, {
                        $push: { messages: createdMessage._id }
                    });

                    const channel = await Channel.findById(channelId).populate("members");
                    
                    const finalData = {
                        ...messageData._doc,
                        channelId: channel._id
                    }

                    // Emit to members
                    if(channel && channel.members){
                        // Send to admin
                        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
                        if(adminSocketId){
                            io.to(adminSocketId).emit("receive-channel-message", finalData);
                        }
                        
                        // Send to other members
                        channel.members.forEach(member => {
                            if(member._id.toString() === channel.admin._id.toString()) return;
                            const memberSocketId = userSocketMap.get(member._id.toString());
                            if(memberSocketId){
                                io.to(memberSocketId).emit('receive-channel-message', finalData);
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error processing channel message:", error);
                }
            });

            socket.on("sendMessage", sendMessage);
            socket.on("disconnect", () => disconnect(socket));
        } else {
            socket.disconnect();
        }
    });

    return io;
}

export default setupSocket;