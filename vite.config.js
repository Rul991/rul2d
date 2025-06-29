import { defineConfig } from 'vite'
import terser from '@rollup/plugin-terser'
import dts from 'vite-plugin-dts'
import createIndexPlugin from 'rollup-auto-index'
import typescript from '@rollup/plugin-typescript'

export default defineConfig(({mode}) => {
  const isTest = mode === 'test'
  const name = isTest ? 'test' : 'index'
  const minFunction = isTest ? () => ({}) : terser
  const createIndex = isTest ? () => ({}) : createIndexPlugin

  return {
    plugins: [
      dts({
        include: ['src'],
        staticImport: true,
        insertTypesEntry: true,
        rollupTypes: true
      }),
      createIndex({
        filename: 'src/index.ts',
        watchedDir: 'src',
        excludeFiles: ['test.ts', 'index.ts'],
        allowedExtensions: ['ts'],
      }),
      minFunction({ keep_classnames: true, keep_fnames: true }),
      typescript()
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: `src/${name}.ts`,
        name: 'rul2d',
        fileName: 'index',
        formats: ['umd']
      },
      rollupOptions: {
        output: {
          entryFileNames: 'index.js',
        },
      },
    },
  }
})