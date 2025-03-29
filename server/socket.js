import {Server as SocketIoServer} from "socket.io"
import Message from "./models/MessagesModel.js"
import Channel from "./models/ChannelModel.js"
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

    // Modify the sendChannelMessage function to bind to socket
    const sendChannelMessage = async function(message) {
        console.log("sendChannelMessage called from socket:", this.id);
        try {
            const {channelId, sender, content, messageType, fileUrl} = message
            console.log("Processing channel message:", {channelId, sender, content, messageType});
            
            // Add validation
            if (messageType === "text" && (!content || content.trim() === "")) {
                console.error("Message content is required for text messages");
                return;
            }
            
            if (messageType === "file" && (!fileUrl || fileUrl.trim() === "")) {
                console.error("File URL is required for file messages");
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
            console.log("Attempting to create message:", messageToCreate);

            const createdMessage = await Message.create(messageToCreate)
            console.log("Created message:", createdMessage);

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .exec()
            console.log("Populated message data:", messageData);

            // Update channel
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createdMessage._id }
            })
            console.log("Updated channel with message");

            const channel = await Channel.findById(channelId).populate("members")
            console.log("Found channel:", channel);
            
            const finalData = {
                ...messageData._doc,
                channelId: channel._id
            }
            console.log("Final data to emit:", finalData);

            // Emit to sockets
            if(channel && channel.members){
                const adminSocketId = userSocketMap.get(channel.admin._id.toString())
                console.log("Admin socket ID:", adminSocketId);
                
                if(adminSocketId){
                    io.to(adminSocketId).emit("receive-channel-message",finalData)
                    console.log("Emitted to admin");
                }
                
                channel.members.forEach(member=>{
                    if(member._id.toString() === channel.admin._id.toString()) return
                    
                    const memberSocketId = userSocketMap.get(member._id.toString())
                    console.log("Member socket ID:", {memberId: member._id, socketId: memberSocketId});
                    
                    if(memberSocketId){
                        io.to(memberSocketId).emit('receive-channel-message',finalData)
                        console.log("Emitted to member:", member._id);
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
                    
                    // Create message
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

                    // Update channel
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