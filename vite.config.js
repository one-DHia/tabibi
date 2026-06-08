import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: false, // We look for manifest.json in public/
    })
  ],
  build: {
    sourcemap: false, // Prevents users from seeing the original source code
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Removes all console.log
        drop_debugger: true, // Removes debugger statements
      },
      format: {
        comments: false, // Remove all comments
      },
    },
  }
})
