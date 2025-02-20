import { create } from "zustand"
import { createAuthSlice } from "./slices/authslice"
import { createChatSlice } from "./slices/chatslice"
export const useAppStore= create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))