export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts :[],
    setSelectedChatType: (selectedChatType) => 
        set((state) => {
            if (state.selectedChatType === selectedChatType) return state;
            return { selectedChatType };
        }),
    setSelectedChatData: (selectedChatData) =>
        set((state) => {
            if (state.selectedChatData?._id === selectedChatData?._id) return state;
            return { selectedChatData };
        }),
    setSelectedChatMessages: (selectedChatMessages) =>
        set((state) => {
            if (JSON.stringify(state.selectedChatMessages) === JSON.stringify(selectedChatMessages)) return state;
            return { selectedChatMessages };
        }),
    setDirectMessagesContacts : (directMessagesContacts)=>set((state)=>{
        if(JSON.stringify(state.directMessagesContacts)===JSON.stringify(directMessagesContacts)) return state;
        return {directMessagesContacts};
    }),
    closeChat: () => {
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: []
        });
    },
    addMessage: (message) => {
        const selectedChatDataMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        const newMessage = {
            ...message,
            recipient: selectedChatType === 'channel' ? message.recipient : message.recipient._id,
            sender: selectedChatType === 'channel' ? message.sender : message.sender._id
        };

        set((state) => ({
            selectedChatMessages: [...state.selectedChatMessages, newMessage]
        }));
    }
});