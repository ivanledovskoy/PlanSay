import { createSlice } from "@reduxjs/toolkit"
import { getInbox } from "../../thunks/tasks"

const initialState: any = {
    all_tasks: []
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getInbox.fulfilled, (state, action) => {
            state.all_tasks = action.payload
        })
    }
})

export default tasksSlice.reducer