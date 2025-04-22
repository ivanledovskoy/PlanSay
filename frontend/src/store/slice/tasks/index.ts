import { createSlice } from "@reduxjs/toolkit"
import { getTasks } from "../../thunks/tasks"

const initialState: any = {
    all_tasks: []
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state.all_tasks = action.payload
        })
    }
})

export default tasksSlice.reducer