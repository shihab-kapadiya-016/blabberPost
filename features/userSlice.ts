import { IUser } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClientUser {
    id: string;
    email: string;
    avatarUrl: string;
    username: string;
}

type userState = {
    currentUser: ClientUser | null 
}

const initialState: userState  = {
    currentUser: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<ClientUser>) => {
            state.currentUser = action.payload
        },
        clearUser: (state) => {
            state.currentUser = null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;