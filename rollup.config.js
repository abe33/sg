import path from 'path';

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';

export default {
  entry: 'src/index.es6',
  dest: 'lib/index.js',
  moduleName: 'sg',
  plugins: [
    includePaths({
      paths: [path.join(process.cwd(), 'src')],
      extensions: ['.js', '.json', '.es6'],
    }),
    nodeResolve({jsnext: true, main: true}),
    commonjs(),
  ],
  format: 'iife',
};
