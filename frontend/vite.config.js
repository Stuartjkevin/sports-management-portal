import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration: enables React (JSX + fast refresh) and fixes the dev port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
