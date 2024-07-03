import path from 'node:path';
import { buildLessFile } from '../common/build/index.js';

buildLessFile(
  path.resolve('./packages/mdui/src/styles/index.less'),
  path.resolve('./packages/mdui/mdui.css'),
).catch((err) => {
  console.error(err);
});
