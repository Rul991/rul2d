import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    output: [
        {
          file: 'dist/index.mjs', 
          format: 'esm',             
          sourcemap: true            
        },
        {
            file: 'dist/index.cjs',
            format: 'commonjs',
            sourcemap: true
        }
    ],
    plugins: [
        nodeResolve({'browser': true}),
        typescript({
            tsconfig: './tsconfig.json'
        })
    ],
    watch: {
        include: 'src/**/*'
    }
}