const fs = require('fs');
const child_process = require('child_process');

child_process.spawnSync('cp', [
  '-r',
  './packages/shared/src/variables',
  './packages/shared/variables',
]);

fs.copyFileSync(
  './packages/shared/src/variables.less',
  './packages/shared/variables.less',
);
