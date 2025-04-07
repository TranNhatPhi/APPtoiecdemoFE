// src/layouts/DashboardLayout.tsx
import { Box, CssBaseline } from "@mui/material";
import SideMenu from "../pages/dashboard/components/SideMenu";
import AppNavbar from "../pages/dashboard/components/AppNavbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <SideMenu />
            <AppNavbar />
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.palette.background.default,
                    overflow: "auto",
                    p: 3,
                })}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
