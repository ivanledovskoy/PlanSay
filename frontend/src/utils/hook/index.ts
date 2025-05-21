import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAuth = () => {
    return !!localStorage.getItem('token')
}

export const checkPasswordChange = () => {
    return !!localStorage.getItem('password_reset_required')
}

export const checkAdmin = () => {
    return !!localStorage.getItem('admin')
}