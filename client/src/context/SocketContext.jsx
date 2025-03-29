import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { 
    userInfo, 
    selectedChatData, 
    selectedChatType, 
    addMessage,
    addChannelInChannelList,
    addContactsInDMContacts  // Add this to destructuring
  } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socketRef.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socketRef.current.on("connect", () => {
        setSocket(socketRef.current);
      });

      const handleReceiveMessage = (message) => {
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        // Add this to update DM contacts list
        addContactsInDMContacts(message);
      };

      const handleReceiveChannelMessage = (message) => {
        if(selectedChatType !== undefined && selectedChatData._id === message.channelId) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      }

      socketRef.current.on("receiveMessage", handleReceiveMessage);
      socketRef.current.on("receive-channel-message", handleReceiveChannelMessage);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          setSocket(null);
        }
      };
    }
  }, [userInfo, selectedChatData, selectedChatType, addMessage, addChannelInChannelList, addContactsInDMContacts]); // Add to dependencies

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
