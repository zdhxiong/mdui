module.exports = {
  globs: ['packages/components/src/**/*.ts', 'packages/shared/src/mixins/*.ts'],
  exclude: [
    'packages/components/src/*.ts',
    'packages/components/src/ripple/*.ts',
    'packages/components/src/**/*style.ts',
  ],
  outdir: 'packages/components',
  dev: true,
  litelement: true,
};
