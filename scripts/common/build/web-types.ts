import fs from 'node:fs';
import path from 'node:path';
import {
  CustomElementField,
  ClassMethod,
  Event,
  CssCustomProperty,
  CssPart,
  Slot,
} from 'custom-elements-manifest';
import { getAllComponents, isAttribute, isProperty } from './component.js';
import { getCssProperties } from './css-properties.js';
import {
  docOrigin,
  getDocUrlByTagName,
  isDocHasMultipleComponents,
  handleDescription,
} from './docs.js';
import {
  i18nLanguages,
  getI18nData,
  getI18nItem,
  I18nData,
  I18nDataSection,
} from './i18n.js';

/**
 * 生成 web-types.{language}.json 文件，供 jetbrains IDE 使用
 * 官方文档：https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#web-components
 * web-types 规范：http://json.schemastore.org/web-types
 *
 * 需要生成 web-types.{language}.json 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的的文件夹名
 */
export const buildWebTypes = (metadataPath: string, packageFolder: string) => {
  i18nLanguages.forEach((language) => {
    const i18nData = getI18nData(language);
    const packagePath = `./packages/${packageFolder}/package.json`;
    const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const webTypes = {
      $schema: 'http://json.schemastore.org/web-types',
      name: packageInfo.name,
      version: packageInfo.version,
      'js-types-syntax': 'typescript',
      'description-markup': 'markdown',
      'framework-config': {
        'enable-when': {
          'node-packages': [packageInfo.name],
        },
      },
      contributions: {
        html: {
          elements: [],
        },
        css: undefined,
      },
    };

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);

      /**
       * @param items
       * @param section
       * @param nameField
       */
      const transform = (
        items: (
          | CustomElementField
          | ClassMethod
          | Event
          | CssCustomProperty
          | CssPart
          | Slot
        )[],
        section: I18nDataSection,
        nameField = 'name',
      ) => {
        // event 只使用通过 @event 注释声明的事件，代码中使用 this.dispatchEvent 触发的事件不放到文档中
        // 这里存在 description 时认为是通过 @event 声明的事件
        const itemsFiltered =
          section === 'events'
            ? (items as Event[]).filter((item) => item.description)
            : items;

        return itemsFiltered.map((item) => {
          const name = item[nameField as 'name'];

          // 可选属性的值可能为 string | undefined，这里移除 undefined
          const type = ((item as CustomElementField).type?.text ?? '')
            .split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined')
            .join(' | ');

          const values: string[] = [];

          if (type) {
            type.split('|').map((val) => {
              // web-types 不支持枚举类型中的注释，移除枚举类型的注释
              val = val.replace(/\/\*([\s\S]*?)\*\//, '').trim();

              if (val) {
                values.push(val);
              }
            });
          }

          const i18nDescription =
            section === 'attributes'
              ? getI18nItem(tagName, 'properties', item.name, language)
                  .description
              : getI18nItem(tagName, section, item.name, language);

          return {
            name,
            description: handleDescription(i18nDescription, language),
            value: values.length
              ? {
                  type: values.length === 1 ? values[0] : values,
                }
              : undefined,
            'doc-url': section
              ? `${docUrl}#${
                  hasMultipleComponents ? tagName.slice(5) + '-' : ''
                }${section}-${
                  section === 'cssProperties'
                    ? name.slice(2)
                    : section === 'slots' && !name
                      ? 'default'
                      : name
                }`
              : undefined,
          };
        });
      };

      const attributes = transform(
        component.members.filter(isAttribute),
        'attributes',
        'attribute', // 使用 attribute 属性作为属性名
      );
      const properties = transform(
        component.members.filter(isProperty),
        'attributes',
      );
      const events = component.events
        ? transform(component.events, 'events')
        : undefined;
      const cssProperties = component.cssProperties
        ? transform(component.cssProperties, 'cssProperties')
        : undefined;
      const cssParts = component.cssParts
        ? transform(component.cssParts, 'cssParts')
        : undefined;
      const slots = component.slots
        ? transform(component.slots, 'slots')
        : undefined;

      (webTypes.contributions.html.elements as unknown[]).push(
        Object.assign(
          {
            name: tagName,
            // summary 注释生成 custom-elements.json 时，空格消失了，所以用 . 代替空格，这里替换回来
            description: handleDescription(
              i18nData[tagName].summary,
              language,
            ).replaceAll('.', ' '),
            attributes,
            priority: 'highest',
            'doc-url': docUrl,
          },
          slots ? { slots } : {},
          properties || events ? { js: { properties, events } } : {},
          cssProperties || cssParts
            ? { css: { properties: cssProperties, parts: cssParts } }
            : {},
        ),
      );
    });

    // 全局 CSS 类、CSS 变量（当前手动维护）
    if (packageFolder === 'mdui') {
      const classes: { name: keyof I18nData['cssClasses']; docUrl: string }[] =
        [
          { name: 'mdui-theme-light', docUrl: '/styles/dark-mode' },
          { name: 'mdui-theme-dark', docUrl: '/styles/dark-mode' },
          { name: 'mdui-theme-auto', docUrl: '/styles/dark-mode' },
          { name: 'mdui-prose', docUrl: '/styles/prose' },
          { name: 'mdui-table', docUrl: '/styles/prose' },
        ];

      (webTypes.contributions.css as unknown) = {
        properties: getCssProperties(language).map((property) => ({
          name: property.name,
          description: handleDescription(property.description, language),
          'doc-url': property.docUrl,
        })),
        classes: classes.map((cls) => ({
          name: cls.name,
          description: i18nData.cssClasses[cls.name].description,
          'description-sections': {
            [i18nData.common.example]: i18nData.cssClasses[cls.name].example,
          },
          'doc-url': `${docOrigin}/${language}/docs/2${cls.docUrl}`,
        })),
      };
    }

    fs.writeFileSync(
      path.resolve(`./packages/${packageFolder}/web-types.${language}.json`),
      JSON.stringify(webTypes, null, 2),
      'utf8',
    );
    fs.writeFileSync(
      path.resolve(
        `./packages/jetbrains-plugin/src/main/resources/web-types/${packageFolder}.web-types.${language}.json`,
      ),
      JSON.stringify(webTypes, null, 2),
      'utf8',
    );
  });
};
