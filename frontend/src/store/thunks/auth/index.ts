import { createAsyncThunk } from "@reduxjs/toolkit";
import { ILoginData, IRegisterData } from "../../../common/types/auth";
import { instance } from "../../../utils/axios";

export const loginUser = createAsyncThunk(
    '/login',
    async (data: ILoginData, {rejectWithValue}) => {
        try {
            const token = await instance.post('/login', data)
            sessionStorage.setItem('token', token.data.token_info.access_token)
            if (token.data.is_admin === true) {
                sessionStorage.setItem('admin', "true")
            }
            return token.data
        } 
        catch (e: any) {
            if (e.response && e.response.data && e.response?.data['detail']) { 
                return rejectWithValue(e.response?.data['detail'])
            }
            else {
                return rejectWithValue("Неизвестная ошибка!")
            }
        }
    }
)

export const registerUser = createAsyncThunk(
    '/register',
    async (data: IRegisterData, {rejectWithValue}) => {
        try {
            const totpKey = await instance.post('/register', data)
            return totpKey.data
        } 
        catch (e: any) {
            if (e.response && e.response.data && e.response?.data['detail']) { 
                return rejectWithValue(e.response?.data['detail'])
            }
            else {
                return rejectWithValue("Неизвестная ошибка!")
            }
        }
    }
)