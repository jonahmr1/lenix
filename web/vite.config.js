import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  
  build: {
    outDir: 'build',
    target: 'esnext',
    rollupOptions: {
      input: './index.html',
      output: {
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/index-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 3
      },
      mangle: {
        toplevel: false, // Change this to false
        properties: {
          regex: /^_/
        },
        reserved: [
          'generateNoImagePlaceholder',
          'takeJob', 
          'markLocation',
          'GetParentResourceName',
          'window',
          'document'
        ]
      },
      format: {
        comments: false
      }
    },
    sourcemap: false
  }
});