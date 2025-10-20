import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ no `css` block here
export default defineConfig({
  plugins: [react()],
})