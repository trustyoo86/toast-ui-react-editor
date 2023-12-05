import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';
import path from 'path';
import css from 'rollup-plugin-css-only';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig } from 'vite';

const external = [
  'react',
  'react-dom',
];

const plugins = [
  resolve({
    preferBuiltins: true,
    modulesOnly: true,
  }),
  typescript({
    exclude: ['*.d.ts', '**/*.d.ts'],
    sourceMap: false,
    declaration: true,
    outDir: 'dist',
  }),
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    exclude: [
      'node_modules',
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  }),
  commonjs(),
  dynamicImportVars(),
];

export default [
  {
    input: 'src/index.tsx',
    output: {
      dir: './dist',
      format: 'esm',
      sourcemap: true,
    },
    plugins,
    external,
  },
  {
    input: './node_modules/@toast-ui/editor/dist/toastui-editor.css',
    output: {
      dir: './dist',
      format: 'iife',
      sourcemap: false,
    },
    plugins: [
      css({
        output: 'toastui-editor.css',
      }),
    ],
  },
];
