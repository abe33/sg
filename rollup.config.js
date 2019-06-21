import path from 'path';

import nodeResolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';

export default [
  config('index'),
  config('browser'),
];

function config(file) {
  return {
    input: `src/${file}.es6`,
    output: {
      file: `lib/${file}.js`,
      format: 'iife',
      name: file,
    },
    plugins: [
      includePaths({
        paths: [path.join(process.cwd(), 'src')],
        extensions: ['.js', '.json', '.es6'],
      }),
      nodeResolve({jsnext: true, main: true}),
    ],
  };
}
