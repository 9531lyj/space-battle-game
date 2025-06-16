import { defineConfig } from 'vite'

export default defineConfig({
  // 基础路径配置 - 用于GitHub Pages等子路径部署
  base: process.env.NODE_ENV === 'production' ? '/space-battle-game/' : '/',
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  
  // 开发服务器配置
  server: {
    host: true,
    port: 5173,
    open: true
  },
  
  // 预览服务器配置
  preview: {
    host: true,
    port: 4173,
    open: true
  },
  
  // 优化配置
  optimizeDeps: {
    include: ['three']
  }
})
