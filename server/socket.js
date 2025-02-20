import {Server as SocketIoServer} from "socket.io"

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

    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId

        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User Connected: ${user.id} with socketID: ${socketId}`);
        }else{
            console.log("User ID not provided during connection")
        }

        socket.on("disconnect",()=>disconnect(socket))
    })
}

export default setupSocket;