import fs from 'node:fs';
import path from 'node:path';
import { CSSDataV1 } from 'vscode-css-languageservice';
import { HTMLDataV1, IAttributeData } from 'vscode-html-languageservice';
import { getAllComponents, isAttribute } from './component.js';
import { getCssProperties } from './css-properties.js';
import {
  getDocUrlByTagName,
  isDocHasMultipleComponents,
  handleDescription,
} from './docs.js';
import { i18nLanguages, getI18nData, getI18nItem } from './i18n.js';

/**
 * 生成 html-data.{language}.json 文件，供 VSCode 使用
 * 官方文档：https://github.com/microsoft/vscode-custom-data
 * VSCode Custom Data 规范：https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
 *                          https://github.com/microsoft/vscode-CSS-languageservice/blob/main/docs/customData.schema.json
 *
 * 需要生成 html-data.{language}.json 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的文件夹名
 */
export const buildVSCodeData = (
  metadataPath: string,
  packageFolder: string,
) => {
  i18nLanguages.forEach((language) => {
    const i18nData = getI18nData(language);
    const vscode: HTMLDataV1 = {
      version: 1.1,
      tags: [],
    };

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);

      const attributes: IAttributeData[] = component.members
        .filter(isAttribute)
        .map((attr) => {
          // 可选属性的值可能为 string | undefined，这里移除 undefined
          const type = (attr.type?.text ?? '')
            .split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined')
            .join(' | ');

          const values: IAttributeData[] = [];

          if (type) {
            // 枚举类型，每个枚举项都可以带有注释
            const isEnum = type.includes('|');

            // 可能是枚举类型、带''的字符串、数值
            type.split('|').map((val) => {
              val = val.trim();

              // 枚举类型含有注释时
              const enumCommentReg = /\/\*([\s\S]*?)\*\//;
              const enumComment = isEnum && val.match(enumCommentReg);
              if (enumComment) {
                val = val.replace(enumCommentReg, '').trim();
              }

              const isString = val.startsWith(`'`) && val.endsWith(`'`);
              const isNumber = Number(val).toString() === val;

              if (isString) {
                val = val.replace(/^'/, '').replace(/'$/, '');
              }

              if (enumComment) {
                // 枚举类型
                values.push({
                  name: val,
                  description: handleDescription(
                    getI18nItem(tagName, 'properties', attr.name, language)
                      .enum![val],
                    language,
                  ),
                });
              } else if (isNumber || isString) {
                // string 和 number
                values.push({ name: val });
              }
            });
          }

          return {
            name: attr.attribute!,
            description: handleDescription(
              getI18nItem(tagName, 'properties', attr.name, language)
                .description,
              language,
            ),
            values: values.length ? values : undefined,
            references: [
              {
                name: i18nData.common.docs,
                url: `${docUrl}#${
                  hasMultipleComponents ? tagName.slice(5) + '-' : ''
                }attributes-${attr.attribute}`,
              },
            ],
          };
        });

      vscode.tags!.push({
        name: tagName,
        // summary 注释生成 custom-elements.json 时，空格消失了，所以用 . 代替空格，这里替换回来
        description: handleDescription(
          i18nData[tagName].summary,
          language,
        ).replaceAll('.', ' '),
        attributes,
        references: [
          {
            name: i18nData.common.docs,
            url: docUrl,
          },
          // { name: '设计规范', url: `https://www.mdui.org/design~3/` },
          {
            name: 'Github',
            url: `https://github.com/zdhxiong/mdui/blob/v2/packages/mdui/src/${component.path.slice(0, -3)}.ts`,
          },
        ],
      });
    });

    fs.writeFileSync(
      path.resolve(`./packages/${packageFolder}/html-data.${language}.json`),
      JSON.stringify(vscode, null, 2),
      'utf8',
    );
    fs.writeFileSync(
      path.resolve(
        `./packages/vscode-extension/${packageFolder}.html-data.${language}.json`,
      ),
      JSON.stringify(vscode, null, 2),
      'utf8',
    );

    // 如果是 mdui 包，额外生成 css-data.{language}.json 文件
    if (packageFolder === 'mdui') {
      const vscodeCSS: CSSDataV1 = {
        version: 1.1,
        properties: getCssProperties(language).map((property) => ({
          name: property.name,
          description: {
            kind: 'markdown',
            value: handleDescription(property.description, language),
          },
          references: [{ name: i18nData.common.docs, url: property.docUrl }],
        })),
      };

      fs.writeFileSync(
        path.resolve(`./packages/${packageFolder}/css-data.${language}.json`),
        JSON.stringify(vscodeCSS, null, 2),
        'utf8',
      );
      fs.writeFileSync(
        path.resolve(
          `./packages/vscode-extension/${packageFolder}.css-data.${language}.json`,
        ),
        JSON.stringify(vscodeCSS, null, 2),
        'utf8',
      );
    }
  });
};
