import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import typescript from 'rollup-plugin-typescript2';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    postcss({
      plugins: [
        postcssUrl({ url: 'inline' }),
        cssnext({ warnForDuplicates: false }),
        cssnano(),
      ],
      extract: 'react-pdfjs-multi.css',
    }),
    external(),
    typescript({
      typescript: require('typescript'),
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
  ],
};
