// eslint-disable-next-line import/no-default-export
export default {
  globs: ['packages/components/src/**/*.ts', 'packages/shared/src/mixins/*.ts'],
  exclude: [
    'packages/components/src/*.ts',
    'packages/components/src/ripple/*.ts',
    'packages/components/src/**/*style.ts',
  ],
  outdir: 'packages/mdui',
  dev: true,
  litelement: true,
};
