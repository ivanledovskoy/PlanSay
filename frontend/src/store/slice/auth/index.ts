import { createSlice } from "@reduxjs/toolkit"
import { IAuthState, IRegisterState } from "../../../common/types/auth"
import { loginUser, registerUser } from "../../thunks/auth"

export const initialState : IAuthState = {
    token: '',
    qrCode: '',
    isLogged: false,
    isLoading: false
}

export const registerState : IRegisterState = {
    qrCode: '',
    isLogged: false,
    isLoading: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, action) => {
            state.isLogged = false
            state.isLoading = true
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.token = action.payload
            state.isLogged = true
            state.isLoading = false
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLogged = false
            state.isLoading = false
        })
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLogged = false
            state.isLoading = true
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.qrCode = action.payload
            state.isLoading = false
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLogged = false
            state.isLoading = false
        })
    }
})

export default authSlice.reducer