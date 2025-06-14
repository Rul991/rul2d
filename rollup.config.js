import dts from 'rollup-plugin-dts'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { argv } from 'process'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import createIndexPlugin from 'rollup-auto-index'

let name = 'index'
let minFunction = terser
let createIndex = options => {}

if(argv.length > 3 && argv[3] == '--test') {
  name = 'test'
  minFunction = (options) => ({})
}

else {
  createIndex = createIndexPlugin
}

export default [
  {
    input: `src/${name}.ts`,
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'rul2d',
        sourcemap: true
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
      createIndex({
        filename: 'src/index.ts',
        watchedDir: 'src',
        excludeFiles: [
          'test.ts',
          'index.ts'
        ],
        allowedExtensions: ['ts']
      }),
      minFunction({'keep_classnames': true, 'keep_fnames': true})
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