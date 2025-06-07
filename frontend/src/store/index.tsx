import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slice/auth";
import { tasksSlice } from "./slice/tasks";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        tasks: tasksSlice.reducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store