import fs from 'node:fs';
import path from 'node:path';
import watch from 'node-watch';
import { buildLitStyleFile } from '../common/build/index.js';

let updating = false;

// src 目录中的 less 文件复制到外层
watch(
  path.resolve('./packages/shared/src'),
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

    if (
      filePath.replace(/\\/g, '/').includes('packages/shared/src/icons') ||
      filePath.replace(/\\/g, '/').includes('packages/shared/src/lit-styles')
    ) {
      updatePromise = buildLitStyleFile(filePath);
    } else {
      fs.copyFileSync(
        filePath,
        filePath.replace('/src/', '/').replace('\\src\\', '\\'),
      );
      updatePromise = Promise.resolve();
    }

    updatePromise.finally(() => {
      updating = false;
    });
  },
);
