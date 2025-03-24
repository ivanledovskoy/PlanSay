import { createSlice } from "@reduxjs/toolkit"
import { IAuthState } from "../../../common/types/auth"

export const initialState : IAuthState = {
    user: {
        id: null,
        email: '',
        tasks: [{
            id: null,
            name: '',
            date: ''
        }]
    },
    isLogged: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload
            state.isLogged = true
        }
    }
})

export const {login} = authSlice.actions
export default authSlice.reducer