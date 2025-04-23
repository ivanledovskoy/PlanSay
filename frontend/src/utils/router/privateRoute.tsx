import { Navigate, Outlet } from "react-router-dom";
import { checkAdmin, useAuth } from "../hook";

const PrivateRoute = () => {
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
