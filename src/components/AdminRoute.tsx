import { Navigate } from "react-router-dom";
import { getUserRoleIdFromToken } from "../utils/auth";

const AdminRoute = ({ children }: { children: any }) => {
    const roleId = getUserRoleIdFromToken();
    const allowedRoles = [1, 3];

    return allowedRoles.includes(roleId || -1)
        ? children
        : <Navigate to="/" replace />;
};

export default AdminRoute;
