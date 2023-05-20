import watch from 'node-watch';
import { buildLessFile } from '../utils.js';

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    return /.(?:less)$/.test(filepath);
  },
};

let updating = false;

watch('./packages/mdui/src/styles', watchOptions, () => {
  if (updating) {
    return;
  }

  updating = true;

  buildLessFile(
    './packages/mdui/src/styles/index.less',
    './packages/mdui/mdui.css',
  ).finally(() => {
    updating = false;
  });
});
