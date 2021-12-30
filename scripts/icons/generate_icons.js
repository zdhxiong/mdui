const fs = require('fs');
const path = require('path');

/**
 * 从 @material-design-icons/svg 项目中生成图标的 Web Components 文件
 *
 * 生成的文件包含两部分：
 * 1. 位于 packages/icons/src/index.ts 文件，所有图标的类定义文件都放在这个文件中
 * 2. 位于 packages/mdui/src/icons 目录中，每个图标一个文件，从 @mdui/icons 中导入图标类，并注册组件
 */

// 字符串转驼峰，且首字母大写
const toCamelCase = (string) => {
  return string
    .replace(/^\S/, (s) => s.toUpperCase())
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 字符串转 - 分隔
const toKebabCase = (string) => {
  return string.replace(/_/g, '-');
};

// 原始 svg 文件（目录名 => 路径）的映射
const folders = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
const dirMap = new Map(
  folders.map((folder) => [
    folder,
    `./node_modules/@material-design-icons/svg/${folder}`,
  ]),
);

// 图标类文件的公共部分模板
const templateHead = `import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { unsafeSVG } from '@mdui/shared/directives.js';
import { style } from './style.js';

const svgTag = (svgPaths: string): TemplateResult => html\`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
  \${unsafeSVG(svgPaths)}
</svg>\`;
`;

// 图标类模板
const templateClass = `export class {{name}} extends LitElement {
  static override styles: CSSResultGroup = style;

  protected override render(): TemplateResult {
    return svgTag('{{svg}}');
  }
}`;

// 注册图标组件的文件模板
const templateComponent = `import { {{className}} } from '@mdui/icons';

window.customElements.define('{{componentName}}', {{className}});

export { {{className}} };

declare global {
  interface HTMLElementTagNameMap {
    '{{componentName}}': {{className}};
  }
}
`;

// 存放图标类字符串的数组
const classContents = [];

dirMap.forEach((dir, folder) => {
  const arr = fs.readdirSync(dir);

  arr.forEach((svgFilename) => {
    const filePath = path.join(dir, svgFilename);

    // 文件名，不含后缀
    const filenamePrefix = svgFilename.split('.')[0];

    // 类名: Icon + 文件名(驼峰) + _目录名(驼峰)
    const className = `Icon${toCamelCase(filenamePrefix)}${
      folder === 'filled' ? '' : `_${toCamelCase(folder)}`
    }`;

    // 组件文件名: 文件名(下划线) + --目录名(下划线；如果是 filled，则不含目录名)
    const componentFilename = `${toKebabCase(filenamePrefix)}${
      folder === 'filled' ? '' : `--${toKebabCase(folder)}`
    }`;

    // 读取 svg 文件中的 path 部分
    const [, svgContent] = fs
      .readFileSync(filePath)
      .toString()
      .match(/<svg.*?>([\s\S]*?)<\/svg>/);

    classContents.push(
      templateClass
        .replace('{{name}}', className)
        .replace('{{svg}}', svgContent),
    );

    // 写入 packages/mdui/src/icons 中的文件
    const componentContent = templateComponent
      .replaceAll('{{className}}', className)
      .replaceAll('{{componentName}}', `mdui-icon-${componentFilename}`);

    fs.writeFileSync(
      `./packages/mdui/src/icons/${componentFilename}.ts`,
      componentContent,
    );
  });
});

// 写入 packages/icons/src/index.ts
fs.writeFileSync(
  './packages/icons/src/index.ts',
  `${templateHead}\n${classContents.join('\n\n')}`,
);
