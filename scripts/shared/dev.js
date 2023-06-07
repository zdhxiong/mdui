import fs from 'node:fs';
import watch from 'node-watch';
import { buildLitStyleFile } from '../utils.js';

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    return /.(?:less)$/.test(filepath);
  },
};

let updating = false;

// src 目录中的 less 文件复制到外层
watch('./packages/shared/src', watchOptions, (_, filePath) => {
  if (updating) {
    return;
  }

  updating = true;

  let updatePromise;

  if (
    filepath.replace(/\\/g, '/').includes('packages/shared/src/icons') ||
    filepath.replace(/\\/g, '/').includes('packages/shared/src/lit-styles')
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
});
