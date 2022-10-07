const fs = require('node:fs');

fs.copyFileSync(
  './packages/shared/src/mixin.less',
  './packages/shared/mixin.less',
);
