/**
 * Vite Configuration for Performance Optimization
 * These settings should be merged into the main vite.config.ts
 */

import { defineConfig } from 'vite';

export const performanceConfig = defineConfig({
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-router',
            '@tanstack/react-form',
          ],
          'ui-vendor': [
            '@base-ui/react',
            '@phosphor-icons/react',
          ],
          'pdf-vendor': [
            '@react-pdf/renderer',
            'pdfjs-dist',
          ],
        },
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify with esbuild (faster than terser)
    minify: 'esbuild',
    // Source maps only in development
    sourcemap: false,
  },
  
  optimization: {
    // Tree shake unused exports
    treeshake: {
      moduleSideEffects: false,
    },
  },
  
  server: {
    // Increase max request concurrency
    middlewareMode: false,
    // Enable compression
    compress: true,
  },
});
