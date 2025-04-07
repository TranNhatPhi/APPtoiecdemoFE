import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    Stack,
    Box,
    CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FullScreenCSVUploaderProps {
    open: boolean;
    onClose: () => void;
    onFileUpload: (file: File) => Promise<void>;
    onSuccess?: () => void;
}

const FullScreenCSVUploader: React.FC<FullScreenCSVUploaderProps> = ({ open, onClose, onFileUpload, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            await onFileUpload(selectedFile);
            onSuccess?.();
            setSelectedFile(null);
            onClose();
        } catch (error) {
            alert('❌ Lỗi khi import file');
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ textAlign: 'center', fontSize: 24, fontWeight: 600 }}>
                📥 Kéo và thả file CSV vào đây
            </DialogTitle>
            <DialogContent>
                <Box
                    {...getRootProps()}
                    sx={{
                        height: 300,
                        border: '3px dashed #90caf9',
                        borderRadius: 2,
                        backgroundColor: isDragActive ? '#e3f2fd' : '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.3s ease',
                        cursor: 'pointer',
                        mb: 2
                    }}
                >
                    <input {...getInputProps()} />
                    <Stack spacing={2} alignItems="center">
                        <CloudUploadIcon sx={{ fontSize: 80, color: '#2196f3' }} />
                        <Typography variant="h6">
                            {isDragActive ? 'Thả file vào đây...' : 'Kéo và thả file CSV hoặc bấm để chọn file'}
                        </Typography>
                        {selectedFile && <Typography fontWeight="bold">📄 {selectedFile.name}</Typography>}
                        {loading && <CircularProgress />}
                    </Stack>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="outlined" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmUpload}
                        disabled={!selectedFile || loading}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenCSVUploader;
