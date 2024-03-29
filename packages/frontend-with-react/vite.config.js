import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: ['@site-wrapper/common']
    },
    build: {
        commonjsOptions: {
            include: ['@site-wrapper/common', /node_modules/]
        }
    },
    plugins: [react()],
    server: {
        // watch: { usePolling: true },
        // host: true,
        // strictPort: true,
        port: 3000
    }
});
