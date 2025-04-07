import React, { useEffect, useRef, useState } from "react";
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid-pro/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppNavbar from '../dashboard/components/AppNavbar';
import Header from '../dashboard/components/Header';
import SideMenu from '../dashboard/components/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from '../dashboard/theme/customizations';
import '@fontsource/roboto';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress,
    Paper,
    Typography,
    Stack,
    TablePagination,
    IconButton,
    Checkbox,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

import { Delete, Edit, FileDownload } from "@mui/icons-material";
import { fetchPaginatedExamResults, deleteExamResult, fetchAllExamResults1 } from "../../services/examResultService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ExamResult } from "../../models/examResult";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

const AdminExamResult: React.FC<{ disableCustomTheme?: boolean }> = (props) => {
    const [results, setResults] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const topRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [exportType, setExportType] = useState("excel");
    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const lastPage = Math.ceil(totalCount / rowsPerPage) - 1;
    const goToFirstPage = () => setPage(0);
    const goToLastPage = () => setPage(lastPage);
    const isFirstPage = page === 0;
    const isLastPage = page === lastPage;
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { results, total } = await fetchPaginatedExamResults(page + 1, rowsPerPage);
            setResults(results);
            setTotalCount(total);
            setLoading(false);
        };
        fetchData();
    }, [page, rowsPerPage]);

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Bạn có chắc chắn muốn xoá kết quả này?",
            showCancelButton: true,
            confirmButtonText: "Xoá",
            cancelButtonText: "Huỷ",
        });
        if (confirm.isConfirmed) {
            await deleteExamResult(id);
            toast.success("✅ Đã xoá thành công!");
            const { results, total } = await fetchPaginatedExamResults(page + 1, rowsPerPage);
            setResults(results);
            setTotalCount(total);
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = results.map((result) => result.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
    };

    const handleBulkDelete = async () => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: `Xác nhận xoá ${selectedIds.length} kết quả?`,
            showCancelButton: true,
            confirmButtonText: "Xoá tất cả",
            cancelButtonText: "Huỷ",
        });
        if (confirm.isConfirmed) {
            for (const id of selectedIds) await deleteExamResult(id);
            toast.success("🧹 Đã xoá các mục đã chọn.");
            setSelectedIds([]);
            const { results, total } = await fetchPaginatedExamResults(page + 1, rowsPerPage);
            setResults(results);
            setTotalCount(total);
        }
    };

    const handleExportAll = async () => {
        const confirm = await Swal.fire({
            title: `Bạn có chắc chắn muốn xuất file ở định dạng ${exportType.toUpperCase()} không?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Xuất file ${exportType.toUpperCase()} ngay`,
            cancelButtonText: "Huỷ"
        });
        if (!confirm.isConfirmed) return;

        try {
            const allResults = await fetchAllExamResults1();
            if (!allResults.length) return toast.info("Không có dữ liệu để xuất.");

            const exportData = allResults.map((r: any) => ({
                ID: r.id,
                Email: r.User?.email,
                User: r.User?.fullname,
                Score: r.score,
                Detail: r.detail,
                CompletedAt: new Date(r.completed_at).toLocaleString(),
            }));

            if (exportType === "pdf") {
                const doc = new jsPDF();
                autoTable(doc, {
                    head: [["ID", "Email", "User", "Score", "Detail", "Time"]],
                    body: exportData.map(r => [r.ID, r.Email, r.User, r.Score, r.Detail, r.CompletedAt]),
                });
                doc.save("exam_results.pdf");
            } else {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Results");
                XLSX.writeFile(wb, `exam_results.${exportType === "csv" ? "csv" : "xlsx"}`);
            }
            toast.success("📁 Xuất file thành công!");
        } catch (err) {
            console.error(err);
            toast.error("❌ Đã xảy ra lỗi khi xuất file!");
        }
    };



    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                <Box component="main" sx={(theme) => ({ flexGrow: 1, backgroundColor: alpha(theme.palette.background.default, 1), overflow: 'auto', minHeight: '100vh', py: 3, px: 4 })}>
                    <Stack spacing={2} className="animate__animated animate__fadeIn">
                        <Header />
                        <div ref={topRef} />
                        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)', transform: 'perspective(1200px)', transition: 'all 0.3s ease-in-out' }} className="animate__animated animate__zoomIn">
                            <Button className="btn-glow" variant="outlined" color="secondary" size="small" onClick={scrollToBottom}>🔽 Đến cuối trang</Button>

                            <Typography variant="h5" mb={2}>📊 Danh sách kết quả bài thi</Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="export-select-label" sx={{ mt: -1, fontWeight: 800 }}>Định dạng</InputLabel>
                                <Select
                                    labelId="export-select-label"
                                    value={exportType}
                                    label="Định dạng"
                                    onChange={(e) => setExportType(e.target.value)}
                                >
                                    <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                                    <MenuItem value="csv">CSV</MenuItem>
                                    <MenuItem value="pdf">PDF</MenuItem>
                                </Select>
                            </FormControl>
                            <Button className="btn-glow" variant="outlined" startIcon={<FileDownload />} onClick={handleExportAll}>
                                📁 Xuất tất cả
                            </Button>
                            <Stack direction="row" spacing={2}>
                                {selectedIds.length > 0 && (
                                    <Button className="btn-glow"
                                        variant="contained"
                                        color="error"
                                        onClick={handleBulkDelete}
                                    >
                                        🗑 Xóa {selectedIds.length} kết quả đã chọn
                                    </Button>
                                )}

                            </Stack>
                            {/* <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">


                            </Stack> */}

                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        indeterminate={selectedIds.length > 0 && selectedIds.length < results.length}
                                                        checked={results.length > 0 && selectedIds.length === results.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                                <TableCell><strong>ID</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Người dùng</strong></TableCell>
                                                <TableCell><strong>Điểm</strong></TableCell>
                                                <TableCell><strong>Chi tiết</strong></TableCell>
                                                <TableCell><strong>Thời gian</strong></TableCell>
                                                <TableCell><strong>Thao tác</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {results.map((result) => (
                                                <TableRow key={result.id}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedIds.includes(result.id)}
                                                            onChange={() => handleSelectOne(result.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{result.id}</TableCell>
                                                    <TableCell>{result.User?.email}</TableCell>
                                                    <TableCell>{result.User?.fullname}</TableCell>
                                                    <TableCell>{result.score}</TableCell>
                                                    <TableCell>{result.detail}</TableCell>
                                                    <TableCell>{new Date(result.completed_at).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="error" onClick={() => handleDelete(result.id)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            <TablePagination
                                component="div"
                                count={totalCount}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                                <Button className="btn-glow" variant={isFirstPage ? "contained" : "outlined"} onClick={goToFirstPage}>⏫ Trang đầu</Button>
                                <Button className="btn-glow" variant={isLastPage ? "contained" : "outlined"} onClick={goToLastPage}>⏬ Trang cuối</Button>
                            </Stack>
                            <Button className="btn-glow" variant="outlined" color="secondary" size="small" onClick={scrollToTop}>🔼 Đến đầu trang</Button>
                            <div ref={bottomRef} />
                        </Paper>
                    </Stack>
                </Box>
            </Box >
        </AppTheme >
    );
};

export default AdminExamResult;