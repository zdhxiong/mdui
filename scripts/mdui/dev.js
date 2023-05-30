import watch from 'node-watch';
import { buildLessFile, buildLitStyleFile } from '../utils.js';

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    return /.(?:less)$/.test(filepath);
  },
};

let updating = false;

watch(
  [
    './packages/mdui/src/components',
    './packages/mdui/src/icons/shared',
    './packages/mdui/src/styles',
  ],
  watchOptions,
  (_, filePath) => {
    if (updating) {
      return;
    }

    updating = true;

    let updatePromise;

    if (filePath.replace(/\\/g, '/').includes('packages/mdui/src/styles')) {
      updatePromise = buildLessFile(
        './packages/mdui/src/styles/index.less',
        './packages/mdui/mdui.css',
      );
    } else {
      updatePromise = buildLitStyleFile(filePath);
    }

    updatePromise.finally(() => {
      updating = false;
    });
  },
);
