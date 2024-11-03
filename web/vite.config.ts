import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig( {
  plugins: [react()],
  envDir: './src',
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
    'process.env.VITE_API_KEY':JSON.stringify(process.env.VITE_API_KEY)
  }
})