const fs = require('fs');
const path = require('path');
const less = require('less');
const { ESLint } = require('eslint');
const postcss = require('postcss');
const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');
const {
  minifyHTMLLiterals,
  defaultMinifyOptions,
} = require('minify-html-literals');

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
      const outputContent = `import {css} from 'lit';export const style = css\`${output}\`;`;
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
  const components = getAllComponents(metadataPath);
  const vscode = { version: 1.1, tags: [] };

  components.map((component) => {
    if (!component.tagName) {
      return;
    }

    const attributes = component.attributes?.map((attr) => {
      const type = attr.type?.text;
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

          // 只处理 string 和 number
          const isString = val.startsWith(`'`);
          const isNumber = Number(val).toString() === val;

          if (isString) {
            val = val.replace(/^'/, '').replace(/'$/, '');
          }

          if (enumComment) {
            values.push({ name: val, description: enumComment[1] });
          } else if (isNumber || isString) {
            values.push({ name: val });
          }
        });
      }

      return {
        name: attr.name,
        description: attr.description,
        values: values.length ? values : undefined,
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
        dir.endsWith('components') ? { references: componentsReferences } : {},
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
        const type = item.type?.text;
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
      component.members?.filter((member) => member.privacy === 'public'),
    );
    const events = transform(component.events);

    webTypes.contributions.html.elements.push(
      Object.assign(
        {
          name: component.tagName,
          description: component.summary,
          attributes,
        },
        properties && events ? { js: { properties, events } } : {},
        dir.endsWith('components')
          ? {
              priority: 'high',
              'doc-url': `https://www.mdui.org/docs/${component.tagName
                .split('-')
                .slice(1)
                .join('-')}`,
            }
          : {},
      ),
    );
  });

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
