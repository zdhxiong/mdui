import path from 'node:path';
import watch from 'node-watch';
import { buildLessFile, buildLitStyleFile } from '../common/build/index.js';

let updating = false;

watch(
  [
    path.resolve('./packages/mdui/src/components'),
    path.resolve('./packages/mdui/src/styles'),
  ],
  {
    recursive: true,
    filter: (filepath) => /.less$/.test(filepath),
  },
  (_, filePath) => {
    if (updating) {
      return;
    }

    updating = true;

    let updatePromise: Promise<void>;

    if (filePath.replace(/\\/g, '/').includes('packages/mdui/src/styles')) {
      updatePromise = buildLessFile(
        path.resolve('./packages/mdui/src/styles/index.less'),
        path.resolve('./packages/mdui/mdui.css'),
      );
    } else {
      updatePromise = buildLitStyleFile(filePath);
    }

    updatePromise.finally(() => {
      updating = false;
    });
  },
);
