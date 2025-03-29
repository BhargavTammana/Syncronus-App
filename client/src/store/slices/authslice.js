export const createAuthSlice = (set, get) => ({
    userInfo : undefined,
    setUserInfo : (userInfo)=>set({userInfo}),
    logout: async () => {
        try {
            // Your existing logout logic
            
            // Reset all states
            get().resetChatSlice() // Reset chat slice
            set({ userInfo: null }) // Reset auth slice
            
            // Any other cleanup
        } catch (error) {
            console.error("Logout error:", error)
        }
    }
})