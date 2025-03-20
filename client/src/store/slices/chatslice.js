export const createChatSlice = (set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages: [],
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setSelectedChatData:(selectedChatData)=>set({selectedChatData}),
    setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    closeChat:()=>{
        set({
            selectedChatType:undefined,
            selectedChatData:undefined,
            selectedChatMessages: []
        })
    },
    addMessage:(message)=>{
        const selectedChatDataMessages = get().selectedChatMessages
        const selectedChatType = get().selectedChatType

        set({
            selectedChatMessages:[...selectedChatDataMessages, {
                ...message,
                recipient:
                    selectedChatType === 'channel'?message.recipient:message.recipient._id,
                sender:
                    selectedChatType === 'channel'?message.sender:message.sender._id
            }],
            
        })
    }
})