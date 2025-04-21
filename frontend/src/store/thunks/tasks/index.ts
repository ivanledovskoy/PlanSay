import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../utils/axios";

export const getTasks = createAsyncThunk(
    '/tasks',
    async (data: any, {rejectWithValue}) => {
        try {
            const tasks = await instance.get('/tasks', data)
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