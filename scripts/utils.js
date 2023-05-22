const fs = require('node:fs');
const path = require('node:path');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const { ESLint } = require('eslint');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import');
const {
  minifyHTMLLiterals,
  defaultMinifyOptions,
} = require('minify-html-literals');
const postcss = require('postcss');

// 是否是开发模式
const isDev = process.argv.slice(2)[0] === '--dev';

/**
 * 遍历文件夹中的文件
 * @param dir 文件夹路径
 * @param suffix 文件后缀
 * @param callback 回调函数，参数为文件路径
 */
function traverseDirectory(dir, suffix, callback) {
  const arr = fs.readdirSync(dir);

  arr.forEach((item) => {
    const filePath = path.join(dir, item);

    if (fs.statSync(filePath).isDirectory()) {
      traverseDirectory(filePath, suffix, callback);
    } else if (filePath.endsWith(suffix)) {
      callback(filePath);
    }
  });
}

/**
 * lit 的 style.less 文件构建成 style.ts 文件
 * @param filePath less 文件路径
 */
function buildLitStyleFile(filePath) {
  const lessInput = fs.readFileSync(filePath).toString();
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
}

/**
 * 把目录中所有的 lit 的 style.less 文件，构建成 style.ts 文件
 * @param path 目录
 */
function buildLitStyleFiles(path) {
  traverseDirectory(path, 'less', (filePath) => {
    buildLitStyleFile(filePath);
  });
}

/**
 * lit 组件生成 js 文件后，进行构建
 * @param filePath js 文件路径
 */
function buildJsFile(filePath) {
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
}

/**
 * 构建目录中所有 lit 组件生成的 js 文件
 * @param path 目录
 */
function buildJsFiles(path) {
  traverseDirectory(path, 'ts', (srcFilePath) => {
    const filePath = srcFilePath
      .replace('/src/', '/')
      .replace('\\src\\', '\\')
      .replace('.ts', '.js');

    buildJsFile(filePath);
  });
}

/**
 * less 文件构建
 * @param filePath less 文件路径
 * @param outputPath 输出的 css 文件路径
 */
function buildLessFile(filePath, outputPath) {
  const lessInput = fs.readFileSync(filePath).toString();
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
}

/**
 * 从 custom-elements.json 文件中提取出组件信息
 * @param metadataPath custom-elements.json 文件的路径
 * @returns {*[]}
 */
function getAllComponents(metadataPath) {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const allComponents = [];

  metadata.modules.map((module) => {
    module.declarations?.map((declaration) => {
      if (!declaration.customElement) {
        return;
      }

      const component = declaration;
      const modulePath = module.path;

      if (component) {
        allComponents.push(Object.assign(component, { modulePath }));
      }
    });
  });

  return allComponents;
}

/**
 * 生成 vscode.html-custom-data.json 文件，供 VSCode 使用
 * VSCode Custom Data 规范：https://github.com/microsoft/vscode-html-languageservice/blob/main/docs/customData.schema.json
 * @param metadataPath custom-elements.json 文件的路径
 */
function buildVSCodeData(metadataPath) {
  const dir = path.dirname(metadataPath);
  const isComponentsPackage = dir.endsWith('components');
  const components = getAllComponents(metadataPath);
  const vscode = {
    version: 1.1,
    tags: [],
  };

  // components 子包添加 icon valueSets
  if (isComponentsPackage) {
    const iconVscodeJson = JSON.parse(
      fs.readFileSync(
        path.resolve('./packages/icons/vscode.html-custom-data.json'),
        'utf8',
      ),
    );
    vscode.valueSets = [
      {
        name: 'icon',
        values: iconVscodeJson.tags.map((tag) => ({
          name: tag.name.split('mdui-icon-')[1],
          description: tag.description,
        })),
      },
    ];
  }

  components.map((component) => {
    if (!component.tagName) {
      return;
    }

    const attributes = component.attributes?.map((attr) => {
      // 可选属性的值可能为 string | undefined，这里移除 undefined
      const type = (attr.type?.text ?? '')
        .split('|')
        .map((v) => v.trim())
        .filter((v) => v && v !== 'undefined')
        .join(' | ');

      let values = [];
      let valueSet = undefined;

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
            values.push({ name: val, description: enumComment[1] });
          } else if (isNumber || isString) {
            // string 和 number
            values.push({ name: val });
          } else if (val === 'MaterialIconsName') {
            // MaterialIconsName valueSets
            valueSet = 'icon';
          }
        });
      }

      return {
        name: attr.name,
        description: attr.description,
        values: values.length ? values : undefined,
        valueSet,
      };
    });

    const componentsReferences = [
      {
        name: '开发文档',
        url: `https://www.mdui.org/docs/${component.tagName
          .split('-')
          .slice(1)
          .join('-')}`,
      },
      { name: '设计规范', url: `https://www.mdui.org/design~3/` },
      {
        name: 'Github',
        url: `https://github.com/zdhxiong/mdui/${component.modulePath}`,
      },
    ];

    vscode.tags.push(
      Object.assign(
        {
          name: component.tagName,
          description: component.summary,
          attributes,
        },
        isComponentsPackage ? { references: componentsReferences } : {},
      ),
    );
  });

  fs.writeFileSync(
    path.join(path.dirname(metadataPath), 'vscode.html-custom-data.json'),
    JSON.stringify(vscode, null, 2),
    'utf8',
  );
}

/**
 * 生成 web-types.json 文件，供 jetbrains IDE 使用
 * web-types 规范：http://json.schemastore.org/web-types
 * @param metadataPath custom-elements.json 文件的路径
 */
function buildWebTypes(metadataPath) {
  const dir = path.dirname(metadataPath);
  const isComponentsPackage = dir.endsWith('components');
  const packagePath = path.join(dir, 'package.json');
  const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const components = getAllComponents(metadataPath);
  const webTypes = {
    $schema: 'http://json.schemastore.org/web-types',
    name: packageInfo.name,
    version: packageInfo.version,
    'description-markup': 'markdown',
    'framework-config': {
      'enable-when': {
        'node-packages': [packageInfo.name],
      },
    },
    'js-types-syntax': 'typescript',
    contributions: {
      html: {
        elements: [],
      },
    },
  };

  components.map((component) => {
    if (!component.tagName) {
      return;
    }

    const transform = (items) => {
      if (!items || !items.length) {
        return;
      }

      return items.map((item) => {
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
          name: item.name,
          description: item.description,
          value: values.length
            ? {
                type: values.length === 1 ? values[0] : values,
              }
            : undefined,
        };
      });
    };

    const attributes = transform(component.attributes);
    const properties = transform(
      component.members?.filter(
        (member) => member.privacy === 'public' && member.kind === 'field',
      ),
    );
    const events = transform(component.events);
    const cssProperties = transform(component.cssProperties);

    webTypes.contributions.html.elements.push(
      Object.assign(
        {
          name: component.tagName,
          description: component.summary,
          attributes,
        },
        properties || events ? { js: { properties, events } } : {},
        cssProperties ? { css: { properties: cssProperties } } : {},
        isComponentsPackage
          ? {
              priority: 'highest',
              'doc-url': `https://www.mdui.org/docs/${component.tagName
                .split('-')
                .slice(1)
                .join('-')}`,
            }
          : {},
      ),
    );
  });

  // 全局 CSS 类、CSS 变量（当前手动维护）
  if (isComponentsPackage) {
    webTypes.contributions.css = {
      properties: [
        // 断点
        { name: '--mdui-breakpoint-mobile', description: '手机的断点' },
        { name: '--mdui-breakpoint-tablet', description: '' },
        { name: '--mdui-breakpoint-laptop', description: '' },
        // 亮色主题颜色
        { name: '--mdui-color-primary-light', description: '' },
        { name: '--mdui-color-primary-container-light', description: '' },
        { name: '--mdui-color-secondary-light', description: '' },
        { name: '--mdui-color-secondary-container-light', description: '' },
        { name: '--mdui-color-tertiary-light', description: '' },
        { name: '--mdui-color-tertiary-container-light', description: '' },
        { name: '--mdui-color-surface-light', description: '' },
        { name: '--mdui-color-surface-variant-light', description: '' },
        { name: '--mdui-color-background-light', description: '' },
        { name: '--mdui-color-error-light', description: '' },
        { name: '--mdui-color-error-container-light', description: '' },
        { name: '--mdui-color-on-primary-light', description: '' },
        { name: '--mdui-color-on-primary-container-light', description: '' },
        { name: '--mdui-color-on-secondary-light', description: '' },
        {
          name: '--mdui-color-on-secondary-container-light',
          description: '',
        },
        { name: '--mdui-color-on-tertiary-light', description: '' },
        { name: '--mdui-color-on-tertiary-container-light', description: '' },
        { name: '--mdui-color-on-surface-light', description: '' },
        { name: '--mdui-color-on-surface-variant-light', description: '' },
        { name: '--mdui-color-on-error-light', description: '' },
        { name: '--mdui-color-on-error-container-light', description: '' },
        { name: '--mdui-color-on-background-light', description: '' },
        { name: '--mdui-color-outline-light', description: '' },
        { name: '--mdui-color-shadow-light', description: '' },
        { name: '--mdui-color-inverse-surface-light', description: '' },
        { name: '--mdui-color-inverse-on-surface-light', description: '' },
        { name: '--mdui-color-inverse-primary-light', description: '' },
        // 暗色主题颜色
        { name: '--mdui-color-primary-dark', description: '' },
        { name: '--mdui-color-primary-container-dark', description: '' },
        { name: '--mdui-color-secondary-dark', description: '' },
        { name: '--mdui-color-secondary-container-dark', description: '' },
        { name: '--mdui-color-tertiary-dark', description: '' },
        { name: '--mdui-color-tertiary-container-dark', description: '' },
        { name: '--mdui-color-surface-dark', description: '' },
        { name: '--mdui-color-surface-variant-dark', description: '' },
        { name: '--mdui-color-background-dark', description: '' },
        { name: '--mdui-color-error-dark', description: '' },
        { name: '--mdui-color-error-container-dark', description: '' },
        { name: '--mdui-color-on-primary-dark', description: '' },
        { name: '--mdui-color-on-primary-container-dark', description: '' },
        { name: '--mdui-color-on-secondary-dark', description: '' },
        { name: '--mdui-color-on-secondary-container-dark', description: '' },
        { name: '--mdui-color-on-tertiary-dark', description: '' },
        { name: '--mdui-color-on-tertiary-container-dark', description: '' },
        { name: '--mdui-color-on-surface-dark', description: '' },
        { name: '--mdui-color-on-surface-variant-dark', description: '' },
        { name: '--mdui-color-on-error-dark', description: '' },
        { name: '--mdui-color-on-error-container-dark', description: '' },
        { name: '--mdui-color-on-background-dark', description: '' },
        { name: '--mdui-color-outline-dark', description: '' },
        { name: '--mdui-color-shadow-dark', description: '' },
        { name: '--mdui-color-inverse-surface-dark', description: '' },
        { name: '--mdui-color-inverse-on-surface-dark', description: '' },
        { name: '--mdui-color-inverse-primary-dark', description: '' },
        // 高程
        { name: '--mdui-elevation-level0', description: '' },
        { name: '--mdui-elevation-level1', description: '' },
        { name: '--mdui-elevation-level2', description: '' },
        { name: '--mdui-elevation-level3', description: '' },
        { name: '--mdui-elevation-level4', description: '' },
        { name: '--mdui-elevation-level5', description: '' },
        // 动画
        { name: '--mdui-motion-easing-standard', description: '' },
        { name: '--mdui-motion-easing-accelerate', description: '' },
        { name: '--mdui-motion-easing-decelerate', description: '' },
        { name: '--mdui-motion-easing-linear', description: '' },
        // 圆角值
        { name: '--mdui-shape-corner-none', description: '' },
        { name: '--mdui-shape-corner-extra-small', description: '' },
        { name: '--mdui-shape-corner-small', description: '' },
        { name: '--mdui-shape-corner-medium', description: '' },
        { name: '--mdui-shape-corner-large', description: '' },
        { name: '--mdui-shape-corner-extra-large', description: '' },
        { name: '--mdui-shape-corner-full', description: '' },
        // 状态层
        { name: '--mdui-state-hover-state-layer-opacity', description: '' },
        { name: '--mdui-state-focus-state-layer-opacity', description: '' },
        { name: '--mdui-state-pressed-state-layer-opacity', description: '' },
        { name: '--mdui-state-dragged-state-layer-opacity', description: '' },
        // 排版（display）
        { name: '--mdui-typescale-display-large-weight', description: '' },
        { name: '--mdui-typescale-display-medium-weight', description: '' },
        { name: '--mdui-typescale-display-small-weight', description: '' },
        {
          name: '--mdui-typescale-display-large-line-height',
          description: '',
        },
        {
          name: '--mdui-typescale-display-medium-line-height',
          description: '',
        },
        {
          name: '--mdui-typescale-display-small-line-height',
          description: '',
        },
        { name: '--mdui-typescale-display-large-size', description: '' },
        { name: '--mdui-typescale-display-medium-size', description: '' },
        { name: '--mdui-typescale-display-small-size', description: '' },
        { name: '--mdui-typescale-display-large-tracking', description: '' },
        { name: '--mdui-typescale-display-medium-tracking', description: '' },
        { name: '--mdui-typescale-display-small-tracking', description: '' },
        // 排版（headline）
        { name: '--mdui-typescale-headline-large-weight', description: '' },
        { name: '--mdui-typescale-headline-medium-weight', description: '' },
        { name: '--mdui-typescale-headline-small-weight', description: '' },
        {
          name: '--mdui-typescale-headline-large-line-height',
          description: '',
        },
        {
          name: '--mdui-typescale-headline-medium-line-height',
          description: '',
        },
        {
          name: '--mdui-typescale-headline-small-line-height',
          description: '',
        },
        { name: '--mdui-typescale-headline-large-size', description: '' },
        { name: '--mdui-typescale-headline-medium-size', description: '' },
        { name: '--mdui-typescale-headline-small-size', description: '' },
        { name: '--mdui-typescale-headline-large-tracking', description: '' },
        {
          name: '--mdui-typescale-headline-medium-tracking',
          description: '',
        },
        { name: '--mdui-typescale-headline-small-tracking', description: '' },
        // 排版（title）
        { name: '--mdui-typescale-title-large-weight', description: '' },
        { name: '--mdui-typescale-title-medium-weight', description: '' },
        { name: '--mdui-typescale-title-small-weight', description: '' },
        { name: '--mdui-typescale-title-large-line-height', description: '' },
        {
          name: '--mdui-typescale-title-medium-line-height',
          description: '',
        },
        { name: '--mdui-typescale-title-small-line-height', description: '' },
        { name: '--mdui-typescale-title-large-size', description: '' },
        { name: '--mdui-typescale-title-medium-size', description: '' },
        { name: '--mdui-typescale-title-small-size', description: '' },
        { name: '--mdui-typescale-title-large-tracking', description: '' },
        { name: '--mdui-typescale-title-medium-tracking', description: '' },
        { name: '--mdui-typescale-title-small-tracking', description: '' },
        // 排版（label）
        { name: '--mdui-typescale-label-large-weight', description: '' },
        { name: '--mdui-typescale-label-medium-weight', description: '' },
        { name: '--mdui-typescale-label-small-weight', description: '' },
        { name: '--mdui-typescale-label-large-line-height', description: '' },
        {
          name: '--mdui-typescale-label-medium-line-height',
          description: '',
        },
        { name: '--mdui-typescale-label-small-line-height', description: '' },
        { name: '--mdui-typescale-label-large-size', description: '' },
        { name: '--mdui-typescale-label-medium-size', description: '' },
        { name: '--mdui-typescale-label-small-size', description: '' },
        { name: '--mdui-typescale-label-large-tracking', description: '' },
        { name: '--mdui-typescale-label-medium-tracking', description: '' },
        { name: '--mdui-typescale-label-small-tracking', description: '' },
        // 排版（body）
        { name: '--mdui-typescale-body-large-weight', description: '' },
        { name: '--mdui-typescale-body-medium-weight', description: '' },
        { name: '--mdui-typescale-body-small-weight', description: '' },
        { name: '--mdui-typescale-body-large-line-height', description: '' },
        { name: '--mdui-typescale-body-medium-line-height', description: '' },
        { name: '--mdui-typescale-body-small-line-height', description: '' },
        { name: '--mdui-typescale-body-large-size', description: '' },
        { name: '--mdui-typescale-body-medium-size', description: '' },
        { name: '--mdui-typescale-body-small-size', description: '' },
        { name: '--mdui-typescale-body-large-tracking', description: '' },
        { name: '--mdui-typescale-body-medium-tracking', description: '' },
        { name: '--mdui-typescale-body-small-tracking', description: '' },
      ],
      classes: [
        {
          name: 'mdui-theme-dark',
          description:
            '把该 class 添加到 `<body>` 元素上，整个页面将显示成暗色模式',
        },
        {
          name: 'mdui-theme-auto',
          description:
            '把该 class 添加到 `<body>` 上，整个页面将根据操作系统的设置，自动切换亮色模式和暗色模式',
        },
        {
          name: 'mdui-prose',
          description: '文章排版样式',
        },
      ],
    };
  }

  fs.writeFileSync(
    path.join(path.dirname(metadataPath), 'web-types.json'),
    JSON.stringify(webTypes, null, 2),
    'utf8',
  );
}

exports.traverseDirectory = traverseDirectory;
exports.buildLitStyleFile = buildLitStyleFile;
exports.buildLitStyleFiles = buildLitStyleFiles;
exports.buildJsFile = buildJsFile;
exports.buildJsFiles = buildJsFiles;
exports.buildLessFile = buildLessFile;
exports.getAllComponents = getAllComponents;
exports.buildVSCodeData = buildVSCodeData;
exports.buildWebTypes = buildWebTypes;
exports.isDev = isDev;
