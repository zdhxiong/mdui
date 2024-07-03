import { moduleFilePathPlugin } from '../common/cem-plugins/module-file-path.js';

// eslint-disable-next-line import/no-default-export
export default {
  globs: [
    'packages/mdui/src/components/**/*.ts',
    'packages/shared/src/mixins/*.ts',
  ],
  exclude: [
    'packages/mdui/src/components/*.ts',
    'packages/mdui/src/components/ripple/*.ts',
    'packages/mdui/src/components/**/*style.ts',
  ],
  outdir: 'packages/mdui',
  dev: false,
  litelement: true,
  plugins: [moduleFilePathPlugin('mdui')],
};
