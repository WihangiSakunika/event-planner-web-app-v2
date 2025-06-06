import { Navigate } from "react-router-dom";
import {JSX} from "react";
import {useAuth} from "../pages/Auth/AuthContext.tsx";

const UserProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const auth: any = useAuth();
    console.log(auth, "auth");

    if (!auth.user || auth?.userType !== "USER") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default UserProtectedRoute;
