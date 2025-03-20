import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { GET_ALL_MESSAGES_ROUTE} from '@/utils/constants'
import moment from 'moment'
import React, { useEffect, useRef, useCallback } from 'react'

const MessageContainer = () => {
  const {selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages} = useAppStore()
  const scrollRef = useRef()

  const getMessages = useCallback(async () => {
    try {
      if (!selectedChatData?._id || selectedChatType !== "contact") {
        return;
      }

      const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedChatData?._id, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData?._id, selectedChatType, getMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    }
  }, [selectedChatMessages])

  const renderMessages = useCallback(() => {
    let lastDate = null
    return selectedChatMessages.map((message,index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      )
    })
  }, [selectedChatMessages, selectedChatType]);

  const renderDMMessages = useCallback((message) => (
    <div className={`${message.sender === selectedChatData._id?"text-left":"text-right"}`}>
      {message.messageType ==="text" && (
        <div className={`${
          message.sender !== selectedChatData._id
            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  ), [selectedChatData._id]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  )
}

export default React.memo(MessageContainer);