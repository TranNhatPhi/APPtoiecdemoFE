import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const PrivateRoute = ({ children }: { children: any }) => {
    return isLoggedIn() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
