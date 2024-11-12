import { create } from "zustand"
import { createAuthSlice } from "./slices/authslice"

export const useAppStore= create()((...a)=>({
    ...createAuthSlice(...a)
}))