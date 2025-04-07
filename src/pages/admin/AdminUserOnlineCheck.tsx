import React, { useEffect, useState } from "react";
import socket from "../../socket"; // ✅ Dùng socket chung
import { fetchAllUsers } from "../../services/userService";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Typography,
    Chip,
    CircularProgress,
    Stack,
    CssBaseline,
    Box
} from "@mui/material";
import AppNavbar from '../dashboard/components/AppNavbar';
import Header from '../dashboard/components/Header';
import SideMenu from '../dashboard/components/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
import { alpha } from '@mui/material/styles';
import "animate.css";

const AdminUserTable: React.FC<{ disableCustomTheme?: boolean }> = (props) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Lỗi khi fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();

        // ✅ Cập nhật online status realtime
        const handleUpdateOnline = (onlineIds: number[]) => {
            setUsers(prev =>
                prev.map(user => ({
                    ...user,
                    online: onlineIds.includes(user.id),
                }))
            );
        };

        socket.on("update-online-users", handleUpdateOnline);

        return () => {
            socket.off("update-online-users", handleUpdateOnline); // ✅ cleanup đúng cách
        };
    }, []);

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                        minHeight: '100vh',
                        py: 3,
                        px: 4
                    })}
                >
                    <Stack spacing={2} className="animate__animated animate__fadeIn">
                        <Header />
                        <Paper
                            sx={{ p: 3, borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' }}
                            className="animate__animated animate__zoomIn"
                        >
                            <Typography variant="h5" mb={2}>📋 Danh sách người dùng</Typography>

                            {loading ? (
                                <Stack direction="row" justifyContent="center">
                                    <CircularProgress />
                                </Stack>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Họ tên</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>SĐT</strong></TableCell>
                                                <TableCell><strong>Ngày sinh</strong></TableCell>
                                                <TableCell><strong>Trạng thái</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map(user => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.id}</TableCell>
                                                    <TableCell>{user.fullname}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phone}</TableCell>
                                                    <TableCell>{new Date(user.date_of_birth).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {user.online ? (
                                                            <Chip label="Online" color="success" />
                                                        ) : (
                                                            <Chip label="Offline" color="default" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
};

export default AdminUserTable;
