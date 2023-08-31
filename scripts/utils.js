import fs from 'node:fs';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import CleanCSS from 'clean-css';
import { ESLint } from 'eslint';
import less from 'less';
import NpmImportPlugin from 'less-plugin-npm-import';
import { minifyHTMLLiterals, defaultMinifyOptions } from 'minify-html-literals';
import postcss from 'postcss';

// 是否是开发模式
export const isDev = process.argv.slice(2)[0] === '--dev';

// 文档页面前缀
const docPathPrefix = 'https://www.mdui.org/docs/2';

// vscode 和 webstorm 中的 description 如果包含链接，默认是不包含域名的，这里手动添加域名
const handleIdeDescription = (description) => {
  if (!description) {
    return '';
  }
  return description.replace('(/docs/2', '(' + docPathPrefix);
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

// 根据组件名（如 mdui-button）获取文档页面url
const getDocUrlByTagName = (tagName) => {
  const pageName = Object.keys(docComponents).find((name) =>
    docComponents[name].includes(tagName),
  );

  if (!pageName) {
    return '';
  }

  return `${docPathPrefix}/components/${pageName}`;
};

// 判断文档页面是否含有多个组件（如 radio 文档页有 mdui-radio 和 mdui-radio-group 两个组件）
const isDocHasMultipleComponents = (tagName) => {
  const pageName = Object.keys(docComponents).find((name) =>
    docComponents[name].includes(tagName),
  );

  if (!pageName) {
    return false;
  }

  return docComponents[pageName].length > 1;
};

// CSS 自定义属性，写入到 css-data.zh-cn.json 及 web-types.zh-cn.json 中
const cssProperties = [
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
      description: `断点值。默认为 \`${width}px\`

**注意**：该断点值不支持在 CSS 媒体查询中使用。

**示例**：
\`\`\`css
/* 修改断点值 */
:root {
  ${name}: ${device === 'xs' ? 0 : width + 20}px;
}
\`\`\`
`,
      docUrl: `${docPathPrefix}/styles/design-tokens#breakpoint`,
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
          const isDark = mode === 'dark';
          const modeName = isDark ? '暗色模式' : '亮色模式';
          return {
            name,
            description: `**${colorName}**

${modeName}的 RGB 颜色值，RGB 三色用 \`,\` 分隔。

通过修改该属性，可以修改${modeName}下的颜色值。

**示例**：
\`\`\`css
/* 设置${modeName}颜色值 */
:root {
  ${name}: 255, 0, 0;
}

/* 读取${modeName}颜色值 */
.element {
  color: rgb(var(${name}));
}

/* 读取自动适配的颜色值 */
.element {
  color: rgb(var(${nameAuto}));
}

/* 读取自动适配的颜色值，并添加不透明度 */
.element {
  color: rgba(var(${nameAuto}), 0.5);
}
\`\`\`
`,
            docUrl: `${docPathPrefix}/styles/design-tokens#color`,
          };
        } else {
          // 自动适配
          return {
            name,
            description: `**${colorName}**

自动适配亮色模式和暗色模式的 RGB 颜色值，RGB 三色用 \`,\` 分隔。

若要设置该颜色值，建议分别设置 \`${nameLight}\` 和 \`${nameDark}\`。

**示例**：
\`\`\`css
/* 读取自动适配的颜色值 */
.element {
  color: rgb(var(${name}));
}

/* 读取自动适配的颜色值，并添加不透明度 */
.element {
  color: rgba(var(${name}), 0.5);
}

/* 分别设置亮色模式、暗色模式的颜色值 */
:root {
  ${nameLight}: 255, 0, 0;
  ${nameDark}: 255, 0, 0;
}
\`\`\`
`,
            docUrl: `${docPathPrefix}/styles/design-tokens#color`,
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
      description: `Level ${value} 级别的高度对应的阴影值。

**示例**：
\`\`\`css
/* 设置 level${value} 级别的高度对应的阴影值 */
:root {
  ${name}: 0 0.5px 1.5px 0 rgba(0, 0, 0, 0.19);
}

/* 读取 level${value} 级别的高度对应的阴影值 */
.element {
  box-shadow: var(${name});
}
\`\`\`
`,
      docUrl: `${docPathPrefix}/styles/design-tokens#elevation`,
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
    const easingName =
      value === 'linear'
        ? '线性动画'
        : value === 'standard'
        ? '标准动画'
        : value === 'standard-accelerate'
        ? '标准加速动画'
        : value === 'standard-decelerate'
        ? '标准减速动画'
        : value === 'emphasized'
        ? '强调动画'
        : value === 'emphasized-accelerate'
        ? '强调加速动画'
        : value === 'emphasized-decelerate'
        ? '强调减速动画'
        : '';

    return {
      name,
      description: `${easingName}的缓动曲线。

**示例**：
\`\`\`css
/* 设置${easingName}的缓动曲线 */
:root {
  ${name}: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 读取${easingName}的缓动曲线 */
.element {
  transition-timing-function: var(${name});
}
\`\`\`
`,
    };
  }),

  // 动画（持续时间）
  ...['short', 'medium', 'long', 'extra-long']
    .map((value) => {
      return [1, 2, 3, 4].map((level) => {
        const name = `--mdui-motion-duration-${value}${level}`;

        return {
          name,
          description: `${value}${level} 级别的动画持续时间。

**示例**：
\`\`\`css
/* 设置 ${value}${level} 级别的动画持续时间 */
:root {
  ${name}: 0.3s;
}

/* 读取 ${value}${level} 级别的动画持续时间 */
.element {
  transition-duration: var(${name});
}
\`\`\`
`,
          docUrl: `${docPathPrefix}/styles/design-tokens#motion`,
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
      description: `${value} 级别的圆角值。

**示例**：
\`\`\`css
/* 设置 ${value} 级别的圆角值 */
:root {
  ${name}: 4px;
}

/* 读取 ${value} 级别的圆角值 */
.element {
  border-radius: var(${name});
}
\`\`\`
`,
      docUrl: `${docPathPrefix}/styles/design-tokens#shape-corner`,
    };
  }),

  // 状态层不透明度
  ...['hover', 'focus', 'pressed', 'dragged'].map((state) => {
    const name = `--mdui-state-layer-${state}`;

    return {
      name,
      description: `\`${state}\` 状态的状态层不透明度。

**示例**：
\`\`\`css
/* 设置 ${state} 状态的状态层不透明度 */
:root {
  ${name}: 0.1;
}
\`\`\`
`,
      docUrl: `${docPathPrefix}/styles/design-tokens#state-layer`,
    };
  }),

  // 排版样式
  ...['display', 'headline', 'title', 'label', 'body']
    .map((style) => {
      return ['large', 'medium', 'small'].map((size) => {
        return ['weight', 'line-height', 'size', 'tracking'].map((property) => {
          const name = `--mdui-typescale-${style}-${size}-${property}`;
          const sizeName =
            size === 'large' ? '大型' : size === 'medium' ? '中等' : '小型';
          const propertyName =
            property === 'weight'
              ? '字重'
              : property === 'line-height'
              ? '行高'
              : property === 'size'
              ? '字体大小'
              : property === 'tracking'
              ? '字间距'
              : '';
          const styleName = `${sizeName} ${style} 类型字体的${propertyName}`;

          return {
            name,
            description: `${styleName}。

**示例**：
\`\`\`css
/* 设置${styleName} */
:root {
  ${name}: ${
              property === 'weight'
                ? 500
                : property === 'line-height'
                ? 1.5
                : property === 'size'
                ? '16px'
                : 0.1
            };
}

/* 读取${styleName} */
.element {
  ${
    property === 'weight'
      ? 'font-weight'
      : property === 'size'
      ? 'font-size'
      : property === 'tracking'
      ? 'letter-spacing'
      : property
  }: var(${name});
}
\`\`\`
`,
            docUrl: `${docPathPrefix}/styles/design-tokens#typescale`,
          };
        });
      });
    })
    .flat(2),
];

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
  const allComponents = [];

  metadata.modules.map((module) => {
    module.declarations?.map((declaration) => {
      // 不是自定义元素时，不处理
      if (!declaration.customElement || !declaration.tagName) {
        return;
      }

      const component = declaration;
      const modulePath = module.path;

      if (component) {
        // 仅从 member 中仅提取 public、且排除部分 lit 内置的属性、且仅提取 field 部分
        // 这里包含了 attribute 和 property 属性，在使用时可通过 attribute 属性是否存在判断是否存在 attribute 属性
        component.members = (component.members ?? []).filter((member) => {
          return (
            member.privacy === 'public' &&
            !['enabledWarnings', 'properties', 'styles'].includes(
              member.name,
            ) &&
            member.kind === 'field'
          );
        });

        allComponents.push(Object.assign(component, { modulePath }));
      }
    });
  });

  return allComponents;
};

/**
 * 生成 html-data.zh-cn.json 文件，供 VSCode 使用
 * 官方文档：https://github.com/microsoft/vscode-custom-data
 * VSCode Custom Data 规范：https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
 *                          https://github.com/microsoft/vscode-CSS-languageservice/blob/main/docs/customData.schema.json
 *
 * 需要生成 html-data.zh-cn.json 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的文件夹名
 */
export const buildVSCodeData = (metadataPath, packageFolder) => {
  const vscode = {
    version: 1.1,
    tags: [],
  };

  // web components 组件
  const components = getAllComponents(metadataPath);
  components.map((component) => {
    const docUrl = getDocUrlByTagName(component.tagName);
    const hasMultipleComponents = isDocHasMultipleComponents(component.tagName);

    const attributes = component.members
      .filter((member) => member.attribute)
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
                description: handleIdeDescription(enumComment[1]),
              });
            } else if (isNumber || isString) {
              // string 和 number
              values.push({ name: val });
            }
          });
        }

        return {
          name: attr.attribute,
          description: handleIdeDescription(attr.description),
          values: values.length ? values : undefined,
          references: [
            {
              name: '开发文档',
              url: `${docUrl}#${
                hasMultipleComponents ? component.tagName.slice(5) + '-' : ''
              }attributes-${attr.attribute}`,
            },
          ],
        };
      });

    vscode.tags.push({
      name: component.tagName,
      // summary 注释生成 custom-elements.json 时，空格消失了，所以用 . 代替空格，这里替换回来
      // todo node 升级到 v16 后，替换为 replaceAll
      description: handleIdeDescription(component.summary).replace(/\./g, ' '),
      attributes: attributes.length ? attributes : undefined,
      references: [
        {
          name: '开发文档',
          url: docUrl,
        },
        // { name: '设计规范', url: `https://www.mdui.org/design~3/` },
        {
          name: 'Github',
          url: `https://github.com/zdhxiong/mdui/${component.modulePath}`,
        },
      ],
    });
  });

  fs.writeFileSync(
    `./packages/${packageFolder}/html-data.zh-cn.json`,
    JSON.stringify(vscode, null, 2),
    'utf8',
  );
  fs.writeFileSync(
    `./packages/vscode-extension/${packageFolder}.html-data.zh-cn.json`,
    JSON.stringify(vscode, null, 2),
    'utf8',
  );

  // 如果是 mdui 包，额外生成 css-data.zh-cn.json 文件
  if (packageFolder === 'mdui') {
    const vscodeCSS = {
      version: 1.1,
      properties: cssProperties.map((property) => ({
        name: property.name,
        description: {
          kind: 'markdown',
          value: handleIdeDescription(property.description),
        },
        references: [{ name: '开发文档', url: property.docUrl }],
      })),
    };

    fs.writeFileSync(
      `./packages/${packageFolder}/css-data.zh-cn.json`,
      JSON.stringify(vscodeCSS, null, 2),
      'utf8',
    );
    fs.writeFileSync(
      `./packages/vscode-extension/${packageFolder}.css-data.zh-cn.json`,
      JSON.stringify(vscodeCSS, null, 2),
      'utf8',
    );
  }
};

/**
 * 生成 web-types.zh-cn.json 文件，供 jetbrains IDE 使用
 * 官方文档：https://plugins.jetbrains.com/docs/intellij/websymbols-web-types.html#web-components
 * web-types 规范：http://json.schemastore.org/web-types
 *
 * 需要生成 web-types.zh-cn.json 的包：mdui
 *
 * @param metadataPath custom-elements.json 文件的路径
 * @param packageFolder 包在 packages 目录中的的文件夹名
 */
export const buildWebTypes = (metadataPath, packageFolder) => {
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
    const docUrl = getDocUrlByTagName(component.tagName);
    const hasMultipleComponents = isDocHasMultipleComponents(component.tagName);

    const transform = (items, sectionPrefix, nameField = 'name') => {
      if (!items || !items.length) {
        return;
      }

      // event 只使用通过 @event 注释声明的事件，代码中使用 this.dispatchEvent 触发的事件不放到文档中
      // 这里存在 description 时认为是通过 @event 声明的事件
      const itemsFiltered =
        sectionPrefix === 'event'
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

        return {
          name: item[nameField],
          description: handleIdeDescription(item.description),
          value: values.length
            ? {
                type: values.length === 1 ? values[0] : values,
              }
            : undefined,
          'doc-url': sectionPrefix
            ? `${docUrl}#${
                hasMultipleComponents ? component.tagName.slice(5) + '-' : ''
              }${sectionPrefix}-${
                sectionPrefix === 'css-properties'
                  ? item[nameField].slice(2)
                  : item[nameField]
              }`
            : undefined,
        };
      });
    };

    const attributes = transform(
      component.members.filter((member) => member.attribute),
      'attributes',
      'attribute', // 使用 attribute 属性作为属性名
    );
    const properties = transform(component.members, 'attributes');
    const events = transform(component.events, 'event');
    const cssProperties = transform(component.cssProperties, 'css-properties');
    const cssParts = transform(component.cssParts, 'css-parts');
    const slots = transform(component.slots, 'slot');

    webTypes.contributions.html.elements.push(
      Object.assign(
        {
          name: component.tagName,
          // summary 注释生成 custom-elements.json 时，空格消失了，所以用 . 代替空格，这里替换回来
          // todo node 升级到 v16 后，替换为 replaceAll
          description: handleIdeDescription(component.summary).replace(
            /\./g,
            ' ',
          ),
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
      properties: cssProperties.map((property) => ({
        name: property.name,
        description: handleIdeDescription(property.description),
        'doc-url': property.docUrl,
      })),
      classes: [
        {
          name: 'mdui-theme-light',
          description:
            '把该 class 添加到某一元素上，该元素及其子元素将显示成亮色模式。',
          'description-sections': {
            示例: `\`\`\`html
<div class="mdui-theme-light"></div>
\`\`\``,
          },
          'doc-url': `${docPathPrefix}/styles/dark-mode`,
        },
        {
          name: 'mdui-theme-dark',
          description:
            '把该 class 添加到 `<html>` 元素上，整个页面将显示成暗色模式。也可以添加到其他元素上，只在该元素及其子元素上显示暗色模式。',
          'description-sections': {
            示例: `\`\`\`html
<!-- 整个页面显示成暗色模式 -->
<html class="mdui-theme-dark"></html>

<!-- 只在该元素及其子元素上显示暗色模式 -->
<div class="mdui-theme-dark"></div>
\`\`\``,
          },
          'doc-url': `${docPathPrefix}/styles/dark-mode`,
        },
        {
          name: 'mdui-theme-auto',
          description:
            '把该 class 添加到 `<html>` 上，整个页面将根据操作系统的设置，自动切换亮色模式和暗色模式。也可以添加到其他元素上，只在该元素及其子元素上自动切换亮色模式和暗色模式。',
          'description-sections': {
            示例: `\`\`\`html
<!-- 整个页面自动切换亮色模式和暗色模式 -->
<html class="mdui-theme-auto"></html>

<!-- 只在该元素及其子元素上自动切换亮色模式和暗色模式 -->
<div class="mdui-theme-auto"></div>
\`\`\``,
          },
          'doc-url': `${docPathPrefix}/styles/dark-mode`,
        },
        {
          name: 'mdui-prose',
          description: '添加该 class，将为文章优化排版样式。',
          'description-sections': {
            示例: `\`\`\`html
<div class="mdui-prose">
  <h1>文章标题</h2>
  <p>文章正文</p>
</div>
\`\`\``,
          },
          'doc-url': `${docPathPrefix}/styles/prose`,
        },
        {
          name: 'mdui-table',
          description: `在 \`<table>\` 元素上添加该 class，可以优化表格的显示样式。

也可以添加在 \`<table>\` 的父元素上，除了优化表格显示样式外，还支持表格横向滚动`,
          'description-sections': {
            示例1: `\`\`\`html
<table class="mdui-table"></table>
\`\`\``,
            示例2: `\`\`\`html
<div class="mdui-table">
  <table></table>
</div>
\`\`\``,
          },
          'doc-url': `${docPathPrefix}/styles/prose`,
        },
      ],
    };
  }

  fs.writeFileSync(
    `./packages/${packageFolder}/web-types.zh-cn.json`,
    JSON.stringify(webTypes, null, 2),
    'utf8',
  );
};
