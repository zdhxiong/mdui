import fs from 'node:fs';

import path from 'node:path';
import { isAttribute, getAllComponents } from './component.js';
import {
  handleDescription,
  getDocUrlByTagName,
  isDocHasMultipleComponents,
} from './docs.js';
import { i18nLanguages, getI18nData, getI18nItem } from './i18n.js';

/**
 * 生成 jsx.d.ts 文件，供使用 React JSX 语法的人使用
 * 官方文档：https://react.dev/learn#writing-markup-with-jsx
 *
 * 需要生成 jsx.d.ts 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的的文件夹名
 */
export const buildJSXTypes = (metadataPath: string, packageFolder: string) => {
  i18nLanguages.forEach((language) => {
    const i18nData = getI18nData(language);
    const jsxElements: {
      name: string;
      docUrl: string;
      description: string;
      attributes: {
        name: string;
        type: string;
        docUrl: string;
        description: string;
      }[];
    }[] = [];

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);

      jsxElements.push({
        name: tagName,
        docUrl,
        description: handleDescription(
          i18nData[tagName].summary,
          language,
        ).replaceAll('.', ' '),
        attributes: component.members.filter(isAttribute).map((attr) => {
          const types = (attr.type?.text ?? '')
            .split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined') // 移除 undefined
            .map((v) => v.replace(/\/\*([\s\S]*?)\*\//, '').trim()); // 移除枚举类型枚举项的注释

          const componentName = `${
            hasMultipleComponents ? tagName.slice(5) + '-' : ''
          }`;

          return {
            name: attr.attribute!,
            type: types.join(' | '),
            docUrl: `${docUrl}#${componentName}attributes-${attr.attribute}`,
            description: handleDescription(
              getI18nItem(tagName, 'properties', attr.name, language)
                .description,
              language,
            ),
          };
        }),
      });
    });

    const jsxType = `import React from 'react';
import { JQ } from '@mdui/jq';

type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        ${jsxElements
          .map(
            (element) => `/**
        * ${element.description.split('\n').join('\n       * ')}
        * @see ${element.docUrl}
        */
        '${element.name}': {
          ${element.attributes
            .map(
              (attribute) => `/**
          * ${attribute.description.split('\n').join('\n         * ')}
          * @see ${attribute.docUrl}
          */
          '${attribute.name}'?: ${attribute.type};`,
            )
            .join('\n        ')}
        } & HTMLElementProps;`,
          )
          .join('\n      ')}
      }
    }
  }
}
`;

    fs.writeFileSync(
      path.resolve(`./packages/${packageFolder}/jsx.${language}.d.ts`),
      jsxType,
      'utf8',
    );
  });
};
