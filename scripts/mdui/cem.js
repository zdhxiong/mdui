import { moduleFilePathPlugin } from '../common/cem/plugins/module-file-path.js';
import sortItems from '../common/cem/plugins/sort-items.js';

/**
 * @type {import('../common/cem/types.js').userConfigOptions}
 */
const config = {
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
  plugins: [moduleFilePathPlugin('mdui'), sortItems()],
};

export default config;
