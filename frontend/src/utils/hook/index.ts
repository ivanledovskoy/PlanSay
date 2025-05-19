import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAuth = () => {
    return !!sessionStorage.getItem('token')
}

export const checkPasswordChange = () => {
    return !!sessionStorage.getItem('password_reset_required')
}

export const checkAdmin = () => {
    return !!sessionStorage.getItem('admin')
}