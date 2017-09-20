import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/index.js',
        external: ['lodash/omit'],
        output: {
            file: 'index.js',
            format: 'cjs',
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
            }),
        ],
    },
    {
        input: 'src/components/index.js',
        external: ['lodash/omit'],
        output: {
            file: 'components.js',
            format: 'cjs',
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
            }),
        ],
    },
];
