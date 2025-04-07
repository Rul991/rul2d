import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        typescript({
            target: 'es6',
            module: 'es6',
            tsconfig: './tsconfig.json'
        })
    ],
    watch: {
        include: 'src/**/*'
    }
}