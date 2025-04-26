import dts from 'rollup-plugin-dts';

import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import createIndexPlugin from './create-index.js';
import { argv } from 'process';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

let name = 'index'
let minFunction = terser

if(argv.length > 3 && argv[3] == '--test') {
  name = 'test'
  minFunction = (options) => ({})
}

export default [
  {
    // for dev: src/test.ts
    // for release: src/index.ts
    input: `src/${name}.ts`,
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'rul2d'
      }
    ],
    plugins: [
      nodeResolve({browser: true}),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
      }),
      createIndexPlugin(),
      minFunction()
    ],
  },

  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts(),
    ],
  },
];