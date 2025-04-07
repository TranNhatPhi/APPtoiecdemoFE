// AdminQuestions.tsx - Giao diện đầy đủ quản lý câu hỏi với hiệu ứng 3D & animation nâng cao

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

import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, CircularProgress,
    Paper, Typography, Stack, TablePagination, IconButton
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { createQuestion, fetchQuestionsWithPagination, importQuestionsFromCSV, deleteQuestion, updateQuestion } from "../../services/questionService";
import FullScreenCSVUploader from './FullScreenCSVUploader';
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "animate.css";
import '../../assets/styles/neon.css'; // Huynh nhớ tạo file neon.css theo hướng dẫn

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

interface Question {
    id: number;
    part_id: number;
    exam_id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d?: string;
    correct_answer: "A" | "B" | "C" | "D";
    image_filename?: string;
    order?: number;
}

const AdminQuestions: React.FC<{ disableCustomTheme?: boolean }> = (props) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingImport, setLoadingImport] = useState(false);




    const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
        part_id: 1,
        exam_id: 1,
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A"
    });

    const topRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastPage = Math.ceil(totalCount / rowsPerPage) - 1;
    const isFirstPage = page === 0;
    const isLastPage = page === lastPage;

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const { questions, total } = await fetchQuestionsWithPagination(page + 1, rowsPerPage);
            setQuestions(questions);
            setTotalCount(total);
        } catch (error) {
            toast.error("❌ Không thể tải danh sách câu hỏi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [page, rowsPerPage]);

    const handleCreateQuestion = async () => {
        setLoadingSave(true); // 👉 bắt đầu loading
        try {
            if (editingQuestionId !== null) {
                await updateQuestion(editingQuestionId, newQuestion);
                toast.success("✅ Đã cập nhật câu hỏi!");
            } else {
                await createQuestion(newQuestion);
                toast.success("✅ Đã thêm câu hỏi!");
            }
            setNewQuestion({
                part_id: 1,
                exam_id: 1,
                question_text: "",
                option_a: "",
                option_b: "",
                option_c: "",
                option_d: "",
                correct_answer: "A"
            });
            setEditingQuestionId(null);
            setOpenDialog(false);
            fetchQuestions();
        } catch (err) {
            console.error(err);
            toast.error("❌ Có lỗi xảy ra khi thêm câu hỏi.");
        } finally {
            setLoadingSave(false); // 👉 kết thúc loading
        }
    };


    const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const goToFirstPage = () => setPage(0);
    const goToLastPage = () => setPage(lastPage);

    const handleCSVUpload = async (file: File) => {
        setLoadingImport(true);
        try {
            await importQuestionsFromCSV(file);
            toast.success("✅ Import CSV thành công!");
            fetchQuestions();
        } catch (error) {
            console.error("❌ Lỗi khi import CSV:", error);
            toast.error("❌ Lỗi khi import CSV");
        } finally {
            setLoadingImport(false);
            setShowUploader(false);
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
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5">📋 Danh sách câu hỏi</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button className="btn-glow" variant="contained" onClick={() => setOpenDialog(true)}>➕ Thêm câu hỏi</Button>
                                    <Button className="btn-glow" variant="outlined" onClick={() => setShowUploader(true)}>📥 Import CSV</Button>
                                </Stack>
                            </Stack>
                            {selectedIds.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={async () => {
                                        const confirm = await Swal.fire({
                                            title: `Xoá ${selectedIds.length} câu hỏi?`,
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Xoá",
                                            cancelButtonText: "Huỷ"
                                        });
                                        if (!confirm.isConfirmed) return;

                                        try {
                                            setLoadingDelete(true);
                                            for (const id of selectedIds) {
                                                await deleteQuestion(id);
                                            }
                                            toast.success("🧹 Đã xoá các câu hỏi đã chọn!");
                                            setSelectedIds([]);
                                            fetchQuestions();
                                        } catch (error) {
                                            toast.error("❌ Lỗi khi xoá!");
                                        } finally {
                                            setLoadingDelete(false);
                                        }
                                    }}

                                    sx={{ mb: 2 }}
                                >
                                    {loadingDelete ? (
                                        <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                                    ) : "🗑 Xóa "}
                                    {selectedIds.length} câu hỏi đã chọn
                                </Button>
                            )}

                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                                    <CircularProgress size={40} />
                                </Box>
                            ) : (
                                <>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox" >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.length === questions.length && questions.length > 0}
                                                            onChange={(e) => {
                                                                setSelectedIds(e.target.checked ? questions.map(q => q.id) : []);
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell><strong>ID</strong></TableCell>
                                                    <TableCell><strong>Phần</strong></TableCell>
                                                    <TableCell><strong>Nội dung</strong></TableCell>
                                                    <TableCell><strong>A</strong></TableCell>
                                                    <TableCell><strong>B</strong></TableCell>
                                                    <TableCell><strong>C</strong></TableCell>
                                                    <TableCell><strong>D</strong></TableCell>
                                                    <TableCell><strong>Đúng</strong></TableCell>
                                                    <TableCell><strong>Order</strong></TableCell>
                                                    <TableCell><strong>Thao tác</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {questions.map((q) => (
                                                    <TableRow key={q.id}>
                                                        <TableCell padding="checkbox">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(q.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setSelectedIds(prev => [...prev, q.id]);
                                                                    else setSelectedIds(prev => prev.filter(id => id !== q.id));
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{q.id}</TableCell>
                                                        <TableCell>{q.part_id}</TableCell>
                                                        <TableCell>{q.question_text}</TableCell>
                                                        <TableCell>{q.option_a}</TableCell>
                                                        <TableCell>{q.option_b}</TableCell>
                                                        <TableCell>{q.option_c}</TableCell>
                                                        <TableCell>{q.option_d || "-"}</TableCell>
                                                        <TableCell>{q.correct_answer}</TableCell>
                                                        <TableCell>{q.order || "-"}</TableCell>
                                                        <TableCell>
                                                            <IconButton className="btn-glow" color="primary" onClick={() => {
                                                                setNewQuestion({ ...q });
                                                                setEditingQuestionId(q.id);
                                                                setOpenDialog(true);
                                                            }}>
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton className="btn-glow" color="error" onClick={async () => {
                                                                const confirm = await Swal.fire({
                                                                    title: "Xoá câu hỏi này?",
                                                                    icon: "warning",
                                                                    showCancelButton: true,
                                                                    confirmButtonText: "Xoá",
                                                                    cancelButtonText: "Huỷ"
                                                                });
                                                                if (!confirm.isConfirmed) return;
                                                                await deleteQuestion(q.id);
                                                                fetchQuestions();
                                                            }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={totalCount}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                                    />
                                </>
                            )}

                            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                                <Button className="btn-glow" variant={isFirstPage ? "contained" : "outlined"} onClick={goToFirstPage}>⏫ Trang đầu</Button>
                                <Button className="btn-glow" variant={isLastPage ? "contained" : "outlined"} onClick={goToLastPage}>⏬ Trang cuối</Button>
                            </Stack>
                            <Button className="btn-glow" variant="outlined" color="secondary" size="small" onClick={scrollToTop}>🔼 Đến đầu trang</Button>
                            <div ref={bottomRef} />
                        </Paper>

                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                            <DialogTitle>{editingQuestionId ? "✏️ Cập nhật câu hỏi" : "➕ Thêm câu hỏi"}</DialogTitle>
                            <DialogContent dividers>
                                <Stack spacing={2}>
                                    <TextField label="Phần" type="number" value={newQuestion.part_id} onChange={e => setNewQuestion({ ...newQuestion, part_id: +e.target.value })} />
                                    <TextField label="Exam ID" type="number" value={newQuestion.exam_id} onChange={e => setNewQuestion({ ...newQuestion, exam_id: +e.target.value })} />
                                    <TextField label="Nội dung câu hỏi" value={newQuestion.question_text} onChange={e => setNewQuestion({ ...newQuestion, question_text: e.target.value })} />
                                    <TextField label="Đáp án A" value={newQuestion.option_a} onChange={e => setNewQuestion({ ...newQuestion, option_a: e.target.value })} />
                                    <TextField label="Đáp án B" value={newQuestion.option_b} onChange={e => setNewQuestion({ ...newQuestion, option_b: e.target.value })} />
                                    <TextField label="Đáp án C" value={newQuestion.option_c} onChange={e => setNewQuestion({ ...newQuestion, option_c: e.target.value })} />
                                    <TextField label="Đáp án D" value={newQuestion.option_d} onChange={e => setNewQuestion({ ...newQuestion, option_d: e.target.value })} />
                                    <TextField select label="Đáp án đúng" value={newQuestion.correct_answer} onChange={e => setNewQuestion({ ...newQuestion, correct_answer: e.target.value as "A" | "B" | "C" | "D" })}>
                                        {["A", "B", "C", "D"].map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button className="btn-glow" onClick={() => setOpenDialog(false)}>Hủy</Button>
                                <Button
                                    className="btn-glow"
                                    onClick={handleCreateQuestion}
                                    variant="contained"
                                    disabled={loadingSave}
                                >
                                    {loadingSave ? <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> : "💾 Lưu"}
                                </Button>

                            </DialogActions>
                        </Dialog>

                        <FullScreenCSVUploader
                            open={showUploader}
                            onClose={() => setShowUploader(false)}
                            onFileUpload={handleCSVUpload}
                            onSuccess={() => fetchQuestions()}
                        />
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
};

export default AdminQuestions;
