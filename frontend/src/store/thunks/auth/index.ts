import { createAsyncThunk } from "@reduxjs/toolkit";
import { ILoginData, IRegisterData } from "../../../common/types/auth";
import { instance } from "../../../utils/axios";

export const loginUser = createAsyncThunk(
    '/login',
    async (data: ILoginData, {rejectWithValue}) => {
        try {
            const resp = await instance.post('/login', data)
            localStorage.setItem('token', resp.data.token_info.access_token)
            if (resp.data.is_admin === true) {
                localStorage.setItem('admin', "true")
            }
            if (resp.data.password_reset_required === true) {
                localStorage.setItem('password_reset_required', "true")
            }
            else if (!!localStorage.getItem('password_reset_required')) {
                localStorage.removeItem('password_reset_required')
            }
            return resp.data
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