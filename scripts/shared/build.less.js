const fs = require('fs');
const child_process = require('child_process');

child_process.spawn('cp', [
  '-r',
  './packages/shared/src/variables',
  './packages/shared/variables',
]);

fs.copyFileSync(
  './packages/shared/src/variables.less',
  './packages/shared/variables.less',
);
