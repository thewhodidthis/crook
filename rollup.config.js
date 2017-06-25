import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.es',
  plugins: [
    babel(),
  ],
  targets: [
    {
      format: 'iife',
      moduleName: 'Crook',
      dest: 'dist/crook.js'
    },
    {
      format: 'cjs',
      dest: 'index.js'
    }
  ]
};
