import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../utils/axios";

export const getInbox = createAsyncThunk(
    '/get/tasks',
    async (jwt_token: any, {rejectWithValue}) => {
        try {
            const tasks = await instance.get('/tasks/inbox', {headers: {'Authorization': `Bearer ${jwt_token}`}})
            return tasks.data
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

export const getCalendar = createAsyncThunk(
    '/get/tasks',
    async (jwt_token: any, {rejectWithValue}) => {
        try {
            const tasks = await instance.get('/tasks/assigned', {headers: {'Authorization': `Bearer ${jwt_token}`}})
            return tasks.data
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

export const getToday = createAsyncThunk(
    '/get/tasks',
    async (jwt_token: any, {rejectWithValue}) => {
        try {
            const tasks = await instance.get('/tasks/today', {headers: {'Authorization': `Bearer ${jwt_token}`}})
            return tasks.data
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