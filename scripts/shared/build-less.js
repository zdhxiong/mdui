import fs from 'node:fs';

fs.copyFileSync(
  './packages/shared/src/mixin.less',
  './packages/shared/mixin.less',
);
