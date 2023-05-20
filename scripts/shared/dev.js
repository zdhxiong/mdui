import fs from 'node:fs';
import watch from 'node-watch';

const watchOptions = {
  recursive: true,
  filter: (filepath) => {
    return /.(?:less)$/.test(filepath);
  },
};

// src 目录中的 less 文件复制到外层
watch('./packages/shared/src', watchOptions, (_, filePath) => {
  fs.copyFileSync(
    filePath,
    filePath.replace('/src/', '/').replace('\\src\\', '\\'),
  );
});
