import dts from 'rollup-plugin-dts';

import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import createIndexPlugin from './create-index.js';
import { argv } from 'process';

let name = 'index'
if(argv.length > 3 && argv[3] == '--test') {
  name = 'test'
}

export default [
  {
    // for dev: src/test.ts
    // for release: src/index.ts
    input: `src/${name}.ts`,
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
        sourceMap: false,
      }),
      nodeResolve({browser: true}),
      createIndexPlugin()
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