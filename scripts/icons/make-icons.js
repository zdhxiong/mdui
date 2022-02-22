const fs = require('fs');
const path = require('path');

/**
 * 从 @material-design-icons/svg 项目中生成图标的 Web Components 文件
 *
 * 生成的文件位于 packages/icons/src 目录中，每个图标一个文件
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

// 读取 package.json 中的 @material-design-icons/svg 版本号
const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json')));
const materialDesignIconsVersion = packageJson.devDependencies[
  '@material-design-icons/svg'
].replace('^', '');

// 原始 svg 文件（目录名 => 路径）的映射
const folders = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
const dirMap = new Map(
  folders.map((folder) => [
    folder,
    `./node_modules/@material-design-icons/svg/${folder}`,
  ]),
);

// 图标组件模板
// language=TypeScript
const template = `import { LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { svgTag } from './shared/svg-tag.js';
import { style } from './shared/style.js';

/**
 * @summary ![](TemplatePreviewPng)
 */
@customElement('TemplateTagName')
export class TemplateClassName extends LitElement {
  static override styles: CSSResultGroup = style;

  protected override render(): TemplateResult {
    return svgTag(
      'TemplateSvgContent'
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'TemplateTagName': TemplateClassName;
  }
}
`;

dirMap.forEach((dir, folder) => {
  const arr = fs.readdirSync(dir);

  arr.forEach((svgFilename) => {
    const filePath = path.join(dir, svgFilename);

    // 文件名，不含后缀
    const filenamePrefix = svgFilename.split('.')[0];

    // 类名: Icon + 文件名(驼峰) + _目录名(驼峰)
    const TemplateClassName = `Icon${toCamelCase(filenamePrefix)}${
      folder === 'filled' ? '' : `_${toCamelCase(folder)}`
    }`;

    // 组件文件名: 文件名(下划线) + --目录名(下划线；如果是 filled，则不含目录名)
    const componentFilename = `${toKebabCase(filenamePrefix)}${
      folder === 'filled' ? '' : `--${toKebabCase(folder)}`
    }`;

    // 用于预览的 png 图片路径
    const TemplatePreviewPng = `https://cdn.w3cbus.com/mdui/icons/${materialDesignIconsVersion}/${folder}/${filenamePrefix}.png`;

    // 读取 svg 文件中的 path 部分
    const [, svgContent] = fs
      .readFileSync(filePath)
      .toString()
      .match(/<svg.*?>([\s\S]*?)<\/svg>/);

    // 写入 packages/icons/src 中的文件
    const componentContent = template
      .replaceAll('TemplateClassName', TemplateClassName)
      .replaceAll('TemplateTagName', `mdui-icon-${componentFilename}`)
      .replaceAll('TemplatePreviewPng', TemplatePreviewPng)
      .replaceAll('TemplateSvgContent', svgContent);

    fs.writeFileSync(
      `./packages/icons/src/${componentFilename}.ts`,
      componentContent,
    );
  });
});
