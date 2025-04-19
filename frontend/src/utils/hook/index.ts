import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAuth = () => {
    // const {isLogged} = useAppSelector((state) => state.auth)
    const isLogged = true       // PLEASE REMOVE ME. IT IS FOR TESING
    return isLogged
}