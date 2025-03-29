export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts :[],
    isUploading:false,
    isDownloading:false,
    fileUploadProgress:0,
    fileDownloadProgress:0,
    channels: [],
    setChannels: (channels) => set((state) => {
        if(state.channels.length === channels.length){
            return state
        }
        return {channels}
    }),
    setIsUploading: (isUploading) => set((state) => ({ isUploading })),
    setIsDownloading: (isDownloading) => set((state) => ({ isDownloading })),
    setFileUploadProgress: (fileUploadProgress) => set((state) => ({ fileUploadProgress })),
    setFileDownloadProgress: (fileDownloadProgress) => set((state) => ({ fileDownloadProgress })),
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
    addChannel: (channel) => {
        const channels = get().channels;
        set({channels:[...channels,channel]})
    },
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
    },
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        if (data) {
            const updatedChannels = channels.filter((channel) => channel._id !== message.channelId);
            // Update the data with latest message if needed
            data.lastMessage = message.content;
            data.lastMessageTime = message.timeStamp;
            // Set the new state with updated channels
            set({ channels: [data, ...updatedChannels] });
        }
    },
    addContactsInDMContacts: (message) => {
        const contacts = get().directMessagesContacts;
        // Find the contact that matches either sender or recipient
        const data = contacts.find((contact) => 
            contact._id === message.sender._id || contact._id === message.recipient._id
        );
        if (data) {
            const updatedContacts = contacts.filter((contact) => 
                contact._id !== message.sender._id && contact._id !== message.recipient._id
            );
            // Update the data with latest message
            data.lastMessage = message.content;
            data.lastMessageTime = message.timeStamp;
            // Set the new state with updated contacts
            set({ directMessagesContacts: [data, ...updatedContacts] });
        }
    },
    resetChatSlice: () => {
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
            directMessagesContacts: [],
            isUploading: false,
            isDownloading: false,
            fileUploadProgress: 0,
            fileDownloadProgress: 0,
            channels: []
        })
    }
});