import fs from 'node:fs';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import CleanCSS from 'clean-css';
import { ESLint } from 'eslint';
import less from 'less';
import NpmImportPlugin from 'less-plugin-npm-import';
import { minifyHTMLLiterals, defaultMinifyOptions } from 'minify-html-literals';
import postcss from 'postcss';

export const isDev = process.argv.slice(2)[0] === '--dev';
export const i18nLanguages = ['en', 'zh-cn'];
const docOrigin = 'https://www.mdui.org';

// 首字母大写
const ucfirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// vscode 和 webstorm 中的 description 如果包含链接，默认是不包含域名的，这里手动添加域名
const handleDescription = (description, language) => {
  return (description || '').replaceAll(
    '](/docs/2/',
    `](${docOrigin}/${language}/docs/2/`,
  );
};

let globalLessMixin = '';
// 获取全局 mixin.less 文件内容
const getGlobalLessMixin = () => {
  if (!globalLessMixin) {
    globalLessMixin = fs
      .readFileSync('./packages/shared/src/mixin.less')
      .toString();
  }

  return globalLessMixin;
};

// 文档页面 及 页面中包含的组件
const docComponents = {
  button: ['mdui-button'],
  'button-icon': ['mdui-button-icon'],
  fab: ['mdui-fab'],
  'segmented-button': ['mdui-segmented-button-group', 'mdui-segmented-button'],
  chip: ['mdui-chip'],
  card: ['mdui-card'],
  checkbox: ['mdui-checkbox'],
  radio: ['mdui-radio-group', 'mdui-radio'],
  switch: ['mdui-switch'],
  slider: ['mdui-slider'],
  'range-slider': ['mdui-range-slider'],
  list: ['mdui-list', 'mdui-list-item', 'mdui-list-subheader'],
  collapse: ['mdui-collapse', 'mdui-collapse-item'],
  tabs: ['mdui-tabs', 'mdui-tab', 'mdui-tab-panel'],
  dropdown: ['mdui-dropdown'],
  menu: ['mdui-menu', 'mdui-menu-item'],
  select: ['mdui-select'],
  'text-field': ['mdui-text-field'],
  'linear-progress': ['mdui-linear-progress'],
  'circular-progress': ['mdui-circular-progress'],
  dialog: ['mdui-dialog'],
  divider: ['mdui-divider'],
  avatar: ['mdui-avatar'],
  badge: ['mdui-badge'],
  icon: ['mdui-icon'],
  tooltip: ['mdui-tooltip'],
  snackbar: ['mdui-snackbar'],
  'navigation-bar': ['mdui-navigation-bar', 'mdui-navigation-bar-item'],
  'navigation-drawer': ['mdui-navigation-drawer'],
  'navigation-rail': ['mdui-navigation-rail', 'mdui-navigation-rail-item'],
  'bottom-app-bar': ['mdui-bottom-app-bar'],
  'top-app-bar': ['mdui-top-app-bar', 'mdui-top-app-bar-title'],
  layout: ['mdui-layout', 'mdui-layout-item', 'mdui-layout-main'],
};

const getPageNameByTagName = (tagName) => {
  const pageName = Object.keys(docComponents).find((name) =>
    docComponents[name].includes(tagName),
  );

  return pageName || '';
};

// 根据组件名（如 mdui-button）获取文档页面url
const getDocUrlByTagName = (tagName, language) => {
  const pageName = getPageNameByTagName(tagName);

  return `${docOrigin}/${language}/docs/2/components/${pageName}`;
};

// 判断文档页面是否含有多个组件（如 radio 文档页有 mdui-radio 和 mdui-radio-group 两个组件）
const isDocHasMultipleComponents = (tagName) => {
  const pageName = getPageNameByTagName(tagName);

  return docComponents[pageName].length > 1;
};

// CSS 自定义属性，写入到 css-data.{language}.json 及 web-types.{language}.json 中
const getCssProperties = (language) => {
  const i18nData = getI18nData(language);

  return [
    // 断点
    ...[
      ['xs', 0],
      ['sm', 600],
      ['md', 840],
      ['lg', 1080],
      ['xl', 1440],
      ['xxl', 1920],
    ].map(([device, width]) => {
      const name = `--mdui-breakpoint-${device}`;

      return {
        name,
        description: i18nData.cssProperties.breakpoint.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{width}}', width)
          .replaceAll('{{newWidth}}', device === 'xs' ? 0 : width + 20),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#breakpoint`,
      };
    }),

    // 亮色、暗色、及自动适配 颜色值
    ...['light', 'dark', '']
      .map((mode) => {
        return [
          'primary',
          'primary-container',
          'on-primary',
          'on-primary-container',
          'inverse-primary',
          'secondary',
          'secondary-container',
          'on-secondary',
          'on-secondary-container',
          'tertiary',
          'tertiary-container',
          'on-tertiary',
          'on-tertiary-container',
          'surface',
          'surface-dim',
          'surface-bright',
          'surface-container-lowest',
          'surface-container-low',
          'surface-container',
          'surface-container-high',
          'surface-container-highest',
          'surface-variant',
          'on-surface',
          'on-surface-variant',
          'inverse-surface',
          'inverse-on-surface',
          'background',
          'on-background',
          'error',
          'error-container',
          'on-error',
          'on-error-container',
          'outline',
          'outline-variant',
          'shadow',
          'surface-tint-color',
          'scrim',
        ].map((color) => {
          const name = `--mdui-color-${color}${mode ? `-${mode}` : ''}`;
          const nameAuto = `--mdui-color-${color}`;
          const nameLight = `--mdui-color-${color}-light`;
          const nameDark = `--mdui-color-${color}-dark`;
          const colorName = color
            .split('-')
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(' ');

          if (mode) {
            // 亮色、或暗色
            const modeName =
              mode === 'dark'
                ? i18nData.cssProperties.darkLightTheme.dark
                : i18nData.cssProperties.darkLightTheme.light;

            return {
              name,
              description: i18nData.cssProperties.darkLightTheme.description
                .replaceAll('{{name}}', name)
                .replaceAll('{{colorName}}', colorName)
                .replaceAll('{{modeName}}', modeName)
                .replaceAll('{{nameAuto}}', nameAuto),
              docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#color`,
            };
          } else {
            // 自动适配
            return {
              name,
              description: i18nData.cssProperties.autoTheme.description
                .replaceAll('{{name}}', name)
                .replaceAll('{{colorName}}', colorName)
                .replaceAll('{{nameLight}}', nameLight)
                .replaceAll('{{nameDark}}', nameDark),
              docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#color`,
            };
          }
        });
      })
      .flat(),

    // 阴影值
    ...[0, 1, 2, 3, 4, 5].map((value) => {
      const name = `--mdui-elevation-level${value}`;

      return {
        name,
        description: i18nData.cssProperties.elevation.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{value}}', value),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#elevation`,
      };
    }),

    // 动画（缓动曲线）
    ...[
      'linear',
      'standard',
      'standard-accelerate',
      'standard-decelerate',
      'emphasized',
      'emphasized-accelerate',
      'emphasized-decelerate',
    ].map((value) => {
      const name = `--mdui-motion-easing-${value}`;
      const easingName = i18nData.cssProperties.easing[value];

      return {
        name,
        description: i18nData.cssProperties.easing.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{easingName}}', easingName),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#motion`,
      };
    }),

    // 动画（持续时间）
    ...['short', 'medium', 'long', 'extra-long']
      .map((value) => {
        return [1, 2, 3, 4].map((level) => {
          const name = `--mdui-motion-duration-${value}${level}`;

          return {
            name,
            description: i18nData.cssProperties.duration.description
              .replaceAll('{{name}}', name)
              .replaceAll('{{value}}', value)
              .replaceAll('{{level}}', level),
            docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#motion`,
          };
        });
      })
      .flat(),

    // 圆角值
    ...[
      'none',
      'extra-small',
      'small',
      'medium',
      'large',
      'extra-large',
      'full',
    ].map((value) => {
      const name = `--mdui-shape-corner-${value}`;

      return {
        name,
        description: i18nData.cssProperties.corner.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{value}}', value),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#shape-corner`,
      };
    }),

    // 状态层不透明度
    ...['hover', 'focus', 'pressed', 'dragged'].map((state) => {
      const name = `--mdui-state-layer-${state}`;

      return {
        name,
        description: i18nData.cssProperties.stateLayer.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{state}}', state),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#state-layer`,
      };
    }),

    // 排版样式
    ...['display', 'headline', 'title', 'label', 'body']
      .map((style) => {
        return ['large', 'medium', 'small'].map((size) => {
          return ['weight', 'line-height', 'size', 'tracking'].map(
            (property) => {
              const name = `--mdui-typescale-${style}-${size}-${property}`;
              const propertyName =
                i18nData.cssProperties.typescale.font[property];
              const styleName = `${ucfirst(style)} ${ucfirst(
                size,
              )} ${propertyName}`;
              const setValue =
                property === 'weight'
                  ? 500
                  : property === 'line-height'
                  ? 1.5
                  : property === 'size'
                  ? '16px'
                  : 0.1;
              const cssPropertyName =
                property === 'weight'
                  ? 'font-weight'
                  : property === 'size'
                  ? 'font-size'
                  : property === 'tracking'
                  ? 'letter-spacing'
                  : property;

              return {
                name,
                description: i18nData.cssProperties.typescale.description
                  .replaceAll('{{styleName}}', styleName)
                  .replaceAll('{{name}}', name)
                  .replaceAll('{{setValue}}', setValue)
                  .replaceAll('{{cssPropertyName}}', cssPropertyName),
                docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#typescale`,
              };
            },
          );
        });
      })
      .flat(2),
  ];
};

/**
 * 遍历文件夹中的文件
 * @param dir 文件夹路径
 * @param suffix 文件后缀
 * @param callback 回调函数，参数为文件路径
 */
export const traverseDirectory = (dir, suffix, callback) => {
  const arr = fs.readdirSync(dir);

  arr.forEach((item) => {
    const filePath = path.join(dir, item);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, suffix, callback);
    } else if (filePath.endsWith(suffix)) {
      callback(filePath);
    }
  });
};

/**
 * lit 的 style.less 文件构建成 style.ts 文件
 * @param filePath less 文件路径
 */
export const buildLitStyleFile = (filePath) => {
  const lessInput = getGlobalLessMixin() + fs.readFileSync(filePath).toString();
  const lessOptions = {
    filename: path.resolve(filePath),
    plugins: [new NpmImportPlugin({ prefix: '~' })],
  };

  return less
    .render(lessInput, lessOptions)
    .then((output) => {
      if (isDev) {
        return output.css;
      }

      return postcss([autoprefixer])
        .process(output.css, { from: undefined })
        .then((result) => result.css);
    })
    .then((output) => {
      const outputName = path.resolve(filePath.replace(/(less)$/, 'ts'));
      const moduleName = path
        .basename(filePath, '.less')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const outputContent = `import {css} from 'lit';export const ${moduleName} = css\`${output}\`;`;
      fs.writeFileSync(outputName, outputContent);

      const eslint = new ESLint({ fix: true });
      eslint
        .lintFiles(outputName)
        .then((results) => ESLint.outputFixes(results));
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * 把目录中所有的 lit 的 style.less 文件，构建成 style.ts 文件
 * @param path 目录
 */
export const buildLitStyleFiles = (path) => {
  traverseDirectory(path, 'less', (filePath) => {
    buildLitStyleFile(filePath);
  });
};

/**
 * lit 组件生成 js 文件后，进行构建
 * @param filePath js 文件路径
 */
export const buildLitJsFile = (filePath) => {
  if (isDev) {
    return;
  }

  const jsInput = fs.readFileSync(filePath).toString();

  const result = minifyHTMLLiterals(jsInput, {
    fileName: 'render.js',
    minifyOptions: {
      ...defaultMinifyOptions,
    },
  });

  const outputName = path.resolve(filePath);

  if (result) {
    fs.writeFileSync(outputName, result.code);
  }
};

/**
 * 构建目录中所有 lit 组件生成的 js 文件
 * @param path 目录
 */
export const buildLitJsFiles = (path) => {
  traverseDirectory(path, 'ts', (srcFilePath) => {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildLitJsFile(filePath);
  });
};

/**
 * less 文件构建
 * @param filePath less 文件路径
 * @param outputPath 输出的 css 文件路径
 */
export const buildLessFile = (filePath, outputPath) => {
  const lessInput = getGlobalLessMixin() + fs.readFileSync(filePath).toString();
  const lessOptions = {
    filename: path.resolve(filePath),
    plugins: [new NpmImportPlugin({ prefix: '~' })],
  };

  return less
    .render(lessInput, lessOptions)
    .then((output) => {
      if (isDev) {
        return output.css;
      }

      return postcss([autoprefixer])
        .process(output.css, { from: undefined })
        .then((result) => new CleanCSS().minify(result.css).styles);
    })
    .then((output) => {
      fs.writeFileSync(outputPath, output);
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * 从 custom-elements.json 文件中提取出组件信息
 * @param metadataPath custom-elements.json 文件的路径
 * @returns {*[]}
 */
export const getAllComponents = (metadataPath) => {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const components = [];

  metadata.modules.map((module) => {
    module.declarations?.map((declaration) => {
      // 不是自定义元素时，不处理
      if (!declaration.customElement || !declaration.tagName) {
        return;
      }

      const component = declaration;
      const modulePath = module.path;

      if (component) {
        // 仅从 member 中仅提取 public、且排除部分 lit 内置的属性
        // 其中包含了属性和方法，使用时可通过 member.kind === 'field' 过滤出属性，通过 member.kind === 'method' 过滤出方法
        // 其中属性包含了 attribute 和 property 属性，在使用时可通过 attribute 属性是否存在，判断是否存在 attribute 属性
        component.members = (component.members ?? []).filter(
          (member) =>
            member.privacy === 'public' &&
            !['enabledWarnings', 'properties', 'styles'].includes(member.name),
        );

        components.push(Object.assign(component, { modulePath }));
      }
    });
  });

  // custom-elements.json 中的组件顺序可能不固定，这里统一按照 tagName 排序
  components.sort((a, b) => a.tagName.localeCompare(b.tagName));

  return components;
};

const i18nDataObject = {};
/**
 * 获取 i18n 翻译数据
 */
export const getI18nData = (language) => {
  if (!i18nDataObject[language]) {
    i18nDataObject[language] = JSON.parse(
      fs.readFileSync(`./docs/${language}.json`, 'utf8'),
    );
  }

  return i18nDataObject[language];
};

/**
 * 获取指定组件的指定属性的翻译文案
 */
const getI18nItem = (tagName, sectionPrefix, name, language) => {
  const i18nData = getI18nData(language);
  let item = i18nData[tagName][sectionPrefix]?.[name];

  // 如果组件中没有对应属性的翻译，从 superclass 中找
  if (!item) {
    item = Object.values(i18nData.superclass)
      .filter((superclass) => superclass.tagNames.includes(tagName))
      .find((superclass) => superclass[sectionPrefix]?.[name])[sectionPrefix]?.[
      name
    ];
  }

  return item;
};

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
export const buildVSCodeData = (metadataPath, packageFolder) => {
  i18nLanguages.forEach((language) => {
    const i18nData = getI18nData(language);
    const vscode = {
      version: 1.1,
      tags: [],
    };

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);

      const attributes = component.members
        .filter((member) => member.kind === 'field' && member.attribute)
        .map((attr) => {
          // 可选属性的值可能为 string | undefined，这里移除 undefined
          const type = (attr.type?.text ?? '')
            .split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined')
            .join(' | ');

          let values = [];

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
                      .enum[val],
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
            name: attr.attribute,
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

      vscode.tags.push({
        name: tagName,
        // summary 注释生成 custom-elements.json 时，空格消失了，所以用 . 代替空格，这里替换回来
        description: handleDescription(
          i18nData[tagName].summary,
          language,
        ).replaceAll('.', ' '),
        attributes: attributes.length ? attributes : undefined,
        references: [
          {
            name: i18nData.common.docs,
            url: docUrl,
          },
          // { name: '设计规范', url: `https://www.mdui.org/design~3/` },
          {
            name: 'Github',
            url: `https://github.com/zdhxiong/mdui/blob/v2/${component.modulePath}`,
          },
        ],
      });
    });

    fs.writeFileSync(
      `./packages/${packageFolder}/html-data.${language}.json`,
      JSON.stringify(vscode, null, 2),
      'utf8',
    );
    fs.writeFileSync(
      `./packages/vscode-extension/${packageFolder}.html-data.${language}.json`,
      JSON.stringify(vscode, null, 2),
      'utf8',
    );

    // 如果是 mdui 包，额外生成 css-data.{language}.json 文件
    if (packageFolder === 'mdui') {
      const vscodeCSS = {
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
        `./packages/${packageFolder}/css-data.${language}.json`,
        JSON.stringify(vscodeCSS, null, 2),
        'utf8',
      );
      fs.writeFileSync(
        `./packages/vscode-extension/${packageFolder}.css-data.${language}.json`,
        JSON.stringify(vscodeCSS, null, 2),
        'utf8',
      );
    }
  });
};

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
export const buildWebTypes = (metadataPath, packageFolder) => {
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
      },
    };

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);

      const transform = (items, sectionPrefix, nameField = 'name') => {
        if (!items || !items.length) {
          return;
        }

        // event 只使用通过 @event 注释声明的事件，代码中使用 this.dispatchEvent 触发的事件不放到文档中
        // 这里存在 description 时认为是通过 @event 声明的事件
        const itemsFiltered =
          sectionPrefix === 'events'
            ? items.filter((item) => item.description)
            : items;

        return itemsFiltered.map((item) => {
          // 可选属性的值可能为 string | undefined，这里移除 undefined
          const type = (item.type?.text ?? '')
            .split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined')
            .join(' | ');

          let values = [];

          if (type) {
            type.split('|').map((val) => {
              // web-types 不支持枚举类型中的注释，移除枚举类型的注释
              val = val.replace(/\/\*([\s\S]*?)\*\//, '').trim();

              if (val) {
                values.push(val);
              }
            });
          }

          const i18nItem = getI18nItem(
            tagName,
            sectionPrefix === 'attributes' ? 'properties' : sectionPrefix,
            item.name,
            language,
          );
          const i18nDescription =
            sectionPrefix === 'attributes' ? i18nItem.description : i18nItem;
          return {
            name: item[nameField],
            description: handleDescription(i18nDescription, language),
            value: values.length
              ? {
                  type: values.length === 1 ? values[0] : values,
                }
              : undefined,
            'doc-url': sectionPrefix
              ? `${docUrl}#${
                  hasMultipleComponents ? tagName.slice(5) + '-' : ''
                }${sectionPrefix}-${
                  sectionPrefix === 'cssProperties'
                    ? item[nameField].slice(2)
                    : sectionPrefix === 'slots' && !item[nameField]
                    ? 'default'
                    : item[nameField]
                }`
              : undefined,
          };
        });
      };

      const attributes = transform(
        component.members.filter(
          (member) => member.kind === 'field' && member.attribute,
        ),
        'attributes',
        'attribute', // 使用 attribute 属性作为属性名
      );
      const properties = transform(
        component.members.filter((member) => member.kind === 'field'),
        'attributes',
      );
      const events = transform(component.events, 'events');
      const cssProperties = transform(component.cssProperties, 'cssProperties');
      const cssParts = transform(component.cssParts, 'cssParts');
      const slots = transform(component.slots, 'slots');

      webTypes.contributions.html.elements.push(
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
      webTypes.contributions.css = {
        properties: getCssProperties(language).map((property) => ({
          name: property.name,
          description: handleDescription(property.description, language),
          'doc-url': property.docUrl,
        })),
        classes: [
          {
            name: 'mdui-theme-light',
            description: i18nData.cssClasses['mdui-theme-light'].description,
            'description-sections': {
              [i18nData.common.example]:
                i18nData.cssClasses['mdui-theme-light'].example,
            },
            'doc-url': `${docOrigin}/${language}/docs/2/styles/dark-mode`,
          },
          {
            name: 'mdui-theme-dark',
            description: i18nData.cssClasses['mdui-theme-dark'].description,
            'description-sections': {
              [i18nData.common.example]:
                i18nData.cssClasses['mdui-theme-dark'].example,
            },
            'doc-url': `${docOrigin}/${language}/docs/2/styles/dark-mode`,
          },
          {
            name: 'mdui-theme-auto',
            description: i18nData.cssClasses['mdui-theme-auto'].description,
            'description-sections': {
              [i18nData.common.example]:
                i18nData.cssClasses['mdui-theme-auto'].example,
            },
            'doc-url': `${docOrigin}/${language}/docs/2/styles/dark-mode`,
          },
          {
            name: 'mdui-prose',
            description: i18nData.cssClasses['mdui-prose'].description,
            'description-sections': {
              [i18nData.common.example]:
                i18nData.cssClasses['mdui-prose'].example,
            },
            'doc-url': `${docOrigin}/${language}/docs/2/styles/prose`,
          },
          {
            name: 'mdui-table',
            description: i18nData.cssClasses['mdui-table'].description,
            'description-sections': {
              [i18nData.common.example]:
                i18nData.cssClasses['mdui-table'].example,
            },
            'doc-url': `${docOrigin}/${language}/docs/2/styles/prose`,
          },
        ],
      };
    }

    fs.writeFileSync(
      `./packages/${packageFolder}/web-types.${language}.json`,
      JSON.stringify(webTypes, null, 2),
      'utf8',
    );
    fs.writeFileSync(
      `./packages/jetbrains-plugin/src/main/resources/web-types/${packageFolder}.web-types.${language}.json`,
      JSON.stringify(webTypes, null, 2),
      'utf8',
    );
  });
};

/**
 * 生成 jsx.d.ts 文件，供使用 React JSX 语法的人使用
 * 官方文档：https://react.dev/learn#writing-markup-with-jsx
 *
 * 需要生成 jsx.d.ts 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的的文件夹名
 */
export const buildJSXTypes = (metadataPath, packageFolder) => {
  i18nLanguages.forEach((language) => {
    const i18nData = getI18nData(language);
    const jsxElements = [];

    // web components 组件
    const components = getAllComponents(metadataPath);
    components.map((component) => {
      const tagName = component.tagName;
      const docUrl = getDocUrlByTagName(tagName, language);
      const hasMultipleComponents = isDocHasMultipleComponents(tagName);
      const attributes = component.members.filter(
        (member) => member.kind === 'field' && member.attribute,
      );

      jsxElements.push({
        name: tagName,
        docUrl,
        description: handleDescription(
          i18nData[tagName].summary,
          language,
        ).replaceAll('.', ' '),
        attributes: attributes.map((item) => {
          const types = item.type?.text
            ?.split('|')
            .map((v) => v.trim())
            .filter((v) => v && v !== 'undefined') // 移除 undefined
            .map((v) => v.replace(/\/\*([\s\S]*?)\*\//, '').trim()); // 移除枚举类型枚举项的注释
          const componentName = `${
            hasMultipleComponents ? tagName.slice(5) + '-' : ''
          }`;
          return {
            name: item.attribute,
            type: types.join(' | '),
            docUrl: `${docUrl}#${componentName}attributes-${item.attribute}`,
            description: handleDescription(
              getI18nItem(tagName, 'properties', item.name, language)
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
  namespace JSX {
    interface IntrinsicElements {
      ${jsxElements
        .map(
          (item) => `/**
       * ${item.description.split('\n').join('\n       * ')}
       * @see ${item.docUrl}
       */
      '${item.name}': {
        ${item.attributes
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
`;

    fs.writeFileSync(
      `./packages/${packageFolder}/jsx.${language}.d.ts`,
      jsxType,
      'utf8',
    );
  });
};
