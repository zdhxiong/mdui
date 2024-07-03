import fs from 'node:fs';
import path from 'node:path';

/**
 * 从 @material-design-icons/svg 项目中生成图标的 Web Components 文件
 *
 * 生成的文件位于 packages/icons/src 目录中，每个图标一个文件
 */

/**
 * 图标变体
 */
type Variant = 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';

// 组件内部用到的图标，统一写入 @mdui/shared/src/icons 中
const sharedIcons = [
  'check-box-outline-blank',
  'check-box',
  'indeterminate-check-box',
  'check',
  'clear',
  'arrow-right',
  'radio-button-unchecked',
  'circle',
  'error',
  'cancel--outlined',
  'visibility-off',
  'visibility',
];

// 字符串转驼峰，且首字母大写
const toCamelCase = (str: string): string => {
  return str
    .replace(/^\S/, (s) => s.toUpperCase())
    .replace(/[-_]([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

// 字符串转 - 分隔
const toKebabCase = (str: string): string => {
  return str.replace(/_/g, '-');
};

// 图标文件夹名
const variants: Variant[] = [
  'filled',
  'outlined',
  'rounded',
  'sharp',
  'two-tone',
];
// 原始 svg 文件（变体名 => 文件夹路径）的映射
const folderPathMap = new Map<Variant, string>(
  variants.map((variant) => [
    variant,
    `./node_modules/@material-design-icons/svg/${variant === 'rounded' ? 'round' : variant}`,
  ]),
);

// 图标组件模板
const template = `import { LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { style } from '@mdui/shared/icons/shared/style.js';
import { svgTag } from '@mdui/shared/icons/shared/svg-tag.js';
import type { TemplateResult, CSSResultGroup } from 'lit';

@customElement('TemplateTagName')
export class TemplateClassName extends LitElement {
  public static override styles: CSSResultGroup = style;

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

// 用于在 @mdui/icons 包中引用 @mdui/shared 中的图标
const templateRef = `export * from '@mdui/shared/icons/TemplateFilename.js';
`;

folderPathMap.forEach((folderPath, variant) => {
  const filenames = fs.readdirSync(folderPath);

  filenames.forEach((filename) => {
    const filePath = path.join(folderPath, filename);

    // 文件名，不含后缀
    const filenamePrefix = filename.split('.')[0];

    // 类名: Icon + 文件名(驼峰) + _变体名(驼峰)
    const TemplateClassName = `Icon${toCamelCase(filenamePrefix)}${
      variant === 'filled' ? '' : `_${toCamelCase(variant)}`
    }`;

    // 组件文件名: 文件名(用-分隔) + --变体名(下划线；如果是 filled，则不含变体名)
    const componentFilename = `${toKebabCase(filenamePrefix)}${
      variant === 'filled' ? '' : `--${toKebabCase(variant)}`
    }`;

    // 读取 svg 文件中的 path 部分
    let svgContent = '';
    const matchResult = fs
      .readFileSync(filePath)
      .toString()
      .match(/<svg.*?>([\s\S]*?)<\/svg>/);
    if (matchResult) {
      svgContent = matchResult[1];
    }

    // 写入 packages/icons/src 中的文件
    const componentContent = template
      .replace(/TemplateClassName/g, TemplateClassName)
      .replace(/TemplateTagName/g, `mdui-icon-${componentFilename}`)
      .replace(/TemplateSvgContent/g, svgContent);

    // 公共图标，写到 @mdui/shared 中
    if (sharedIcons.includes(componentFilename)) {
      fs.writeFileSync(
        path.resolve(`./packages/shared/src/icons/${componentFilename}.ts`),
        componentContent.replace(/@mdui\/shared\/icons\//g, './'),
      );
      fs.writeFileSync(
        path.resolve(`./packages/icons/src/${componentFilename}.ts`),
        templateRef.replace(/TemplateFilename/g, componentFilename),
      );
    }
    // 非公共图标，写道 @mdui/icons 中
    else {
      fs.writeFileSync(
        path.resolve(`./packages/icons/src/${componentFilename}.ts`),
        componentContent,
      );
    }
  });
});
