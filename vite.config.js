import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

/** @type {import('vite').UserConfig} */
export default {
  build: {
    outDir: 'dist',
    manifest: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.tsx'),
      fileName: 'index',
      formats: ['esm', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: true,
          declaration: true,
          outDir: 'dist',
        }),
      ],
    },
  },
};
