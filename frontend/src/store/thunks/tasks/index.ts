import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../utils/axios";

export const getTasks = createAsyncThunk(
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

export const updateTask = createAsyncThunk(
    '/tasks',
    async (data: any, {rejectWithValue}) => {
        try {
            console.log(data)
            //const tasks = await instance.put( `/tasks/${123}`, {headers: {'Authorization': `Bearer ${jwt_token}`}})
            //return tasks.data
            return true
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