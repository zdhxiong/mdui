import fs from 'node:fs';
import path from 'node:path';

fs.copyFileSync(
  path.resolve('./packages/shared/src/mixin.less'),
  path.resolve('./packages/shared/mixin.less'),
);
