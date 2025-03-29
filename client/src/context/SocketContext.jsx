import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo, selectedChatData, selectedChatType, addMessage } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      if (!socket.current) {
        socket.current = io(HOST, {
          withCredentials: true,
          query: { userId: userInfo.id },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
      }

      socket.current.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socket.current.on("connect_error", (error) => {
        console.log("Socket connection error:", error);
      });

      socket.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      const handleReceiveMessage = (message) => {
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
        ) {
          console.log("Received message", message);
          addMessage(message);
        }
      };

      const handleReceiveChannelMessage = (message)=>{
        console.log("SocketContext: Received channel message", message);
        console.log("Current chat type:", selectedChatType);
        console.log("Current chat data:", selectedChatData);
        console.log("Message channelId:", message.channelId);
        if(selectedChatType === "channel" && selectedChatData._id === message.channelId){
          console.log("Adding message to state");
          addMessage(message);
        } else {
          console.log("Message not added because:", {
            selectedChatType,
            selectedChatId: selectedChatData?._id,
            messageChannelId: message.channelId
          });
        }
      }

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message",handleReceiveChannelMessage)
      return () => {
        if (socket.current) {
          socket.current.off("connect");
          socket.current.off("connect_error");
          socket.current.off("disconnect");
          socket.current.off("receiveMessage");
          socket.current.off("receive-channel-message");
        }
      };
    }
  }, [userInfo]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
