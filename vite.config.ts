import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    base: '/', // ← thêm dòng này, đảm bảo đường dẫn gốc luôn đúng khi deploy
});
