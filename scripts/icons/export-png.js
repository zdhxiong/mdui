import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import svgexport from 'svgexport';

/**
 * 根据 @material-design-icons/svg 项目中的 svg 图标，生成对应的 png 图片
 */

// 原始 svg 文件（目录名 => 路径）的映射
const folders = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
const dirMap = new Map(
  folders.map((folder) => [
    folder === 'round' ? 'rounded' : folder,
    path.resolve(`./node_modules/@material-design-icons/svg/${folder}`),
  ]),
);

// 创建存放 png 文件的根目录
const outputPath = path.resolve('icons-png');
child_process.spawnSync('rm', ['-rf', 'icons-png']);
fs.mkdirSync(outputPath);

const items = []; // { input: '', output: '' }[]
dirMap.forEach((dir, folder) => {
  // 创建子目录
  const subOutputPath = path.join(outputPath, folder);
  fs.mkdirSync(subOutputPath);

  const arr = fs.readdirSync(dir);

  arr.forEach((svgFilename) => {
    const filePath = path.join(dir, svgFilename);
    items.push({
      input: filePath,
      output: [
        [
          path.join(subOutputPath, `${svgFilename.split('.')[0]}.png`),
          '40:',
          'svg{background:white;}',
        ],
      ],
    });
  });
});

const makeIcon = (item) => {
  svgexport.render(item, () => {
    const item = items.shift();
    if (item) {
      console.log(`剩余 ${items.length} 个`);
      makeIcon(item);
    } else {
      console.log('生成成功!');
    }
  });
};

console.log('开始生成 png 格式的图标文件，约需几个小时!');

makeIcon(items.shift());
