import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // ← Đổi sang cổng nào tuỳ ý (ví dụ: 3000 hoặc 8080)
    },
});
