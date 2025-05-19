import { Navigate, Outlet } from "react-router-dom";
import { checkAdmin, checkPasswordChange, useAuth } from "../hook";

const PrivateRoute = () => {
    const auth = useAuth()
    const password_change = checkPasswordChange()
    return (
        (auth && !password_change) ? <Outlet /> : 
        !auth ? <Navigate to="/login" /> : <Navigate to="/account" />
    );
}

export const AccountRoute = () => {
    const auth = useAuth()
    return (
        auth ? <Outlet /> : <Navigate to="login" />
    );
}

export const AdminRoute = () => {
    const auth = checkAdmin()
    return (
        auth ? <Outlet /> : <Navigate to="/inbox" />
    );
}

export default PrivateRoute;
