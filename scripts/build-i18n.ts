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
import {
  i18nLanguages,
  I18nData,
  getAllComponents,
  I18nDataSection,
  I18nDataItem,
  isProperty,
  isMethod,
} from './common/build/index.js';

const languages = i18nLanguages.filter((i) => i !== 'zh-cn'); // 目标文件，zh-cn 作为原始文件不列入其中
const components = getAllComponents(
  path.resolve('./packages/mdui/custom-elements.json'),
);
const originJson: I18nData = {
  // 所有继承自父类的属性放这里
  superclass: {},
};

// 从 custom-elements.json 中提取要翻译的文案
components.forEach((component) => {
  const tagName = component.tagName;

  originJson[tagName] = {};
  originJson[tagName].summary = component.summary;

  const section: I18nDataSection[] = [
    'properties',
    'methods',
    'events',
    'slots',
    'cssParts',
    'cssProperties',
  ];

  section.forEach((key) => {
    const items: (
      | CustomElementField
      | ClassMethod
      | Event
      | Slot
      | CssPart
      | CssCustomProperty
    )[] =
      key === 'properties'
        ? component.members.filter(isProperty)
        : key === 'methods'
          ? component.members.filter(isMethod)
          : key === 'events'
            ? (component[key] ?? []).filter((event) => event.description)
            : component[key] ?? [];

    items.forEach((_item) => {
      const item = _item as CustomElementField; // 其他类型和 CustomElementField 结构一致
      const itemName = item.name;
      let itemValue: I18nDataItem | string;

      // properties 中的枚举类型每个都有单独的注释
      if (key === 'properties') {
        // 可选属性的值可能为 string | undefined，这里移除 undefined
        const type = (item.type?.text ?? '')
          .split('|')
          .map((v) => v.trim())
          .filter((v) => v && v !== 'undefined')
          .join(' | ');

        const enumDesc: Record<string, string> = {};

        if (type) {
          // 枚举类型，每个枚举项都可以带有注释
          const isEnum = type.includes('|');

          // 可能是枚举类型、带''的字符串、数值
          type.split('|').forEach((val) => {
            val = val.trim();

            // 枚举类型含有注释时
            const enumCommentReg = /\/\*([\s\S]*?)\*\//;
            const enumComment = isEnum && val.match(enumCommentReg);
            if (enumComment) {
              val = val.replace(enumCommentReg, '').trim();
            }

            const isString = val.startsWith(`'`) && val.endsWith(`'`);
            if (isString) {
              val = val.replace(/^'/, '').replace(/'$/, '');
            }

            if (enumComment) {
              // 枚举类型
              enumDesc[val] = enumComment[1];
            }
          });
        }

        itemValue = {
          description: item.description!,
          enum: Object.keys(enumDesc).length ? enumDesc : undefined,
        };
      } else {
        itemValue = item.description!;
      }

      if (
        item.inheritedFrom &&
        item.name !== 'scrollBehavior' // scrollBehavior 在每个父类中单独定义
      ) {
        const inherited = item.inheritedFrom.name;
        const superclass = originJson.superclass;

        superclass[inherited] = superclass[inherited] || {};
        superclass[inherited][key] = superclass[inherited][key] || {};
        superclass[inherited][key][itemName] = itemValue;

        superclass[inherited].tagNames = superclass[inherited].tagNames || [];
        if (!superclass[inherited].tagNames.includes(tagName)) {
          superclass[inherited].tagNames.push(tagName);
        }
      } else {
        originJson[tagName][key] = originJson[tagName][key] || {};
        originJson[tagName][key][itemName] = itemValue;
      }
    });
  });
});

// 其他通用文案
originJson.common = {
  docs: '开发文档',
  example: '示例',
};

// CSS 自定义属性
originJson.cssProperties = {
  breakpoint: {
    description: `断点值。默认为 \`{{width}}px\`

**注意**：该断点值不支持在 CSS 媒体查询中使用。

**示例**：
\`\`\`css
/* 修改断点值 */
:root {
  {{name}}: {{newWidth}}px;
}
\`\`\`
`,
  },
  darkLightTheme: {
    dark: '暗色模式',
    light: '亮色模式',
    description: `**{{colorName}}**

{{modeName}}的 RGB 颜色值，RGB 三色用 \`,\` 分隔。

修改该属性可以改变{{modeName}}下的颜色值。

**示例**：
\`\`\`css
/* 设置{{modeName}}颜色值 */
:root {
  {{name}}: 255, 0, 0;
}

/* 读取{{modeName}}颜色值 */
.element {
  color: rgb(var({{name}}));
}

/* 读取自动适配的颜色值 */
.element {
  color: rgb(var({{nameAuto}}));
}

/* 读取自动适配的颜色值，并添加不透明度 */
.element {
  color: rgba(var({{nameAuto}}), 0.5);
}
\`\`\`
`,
  },
  autoTheme: {
    description: `**{{colorName}}**

自动适配亮色模式和暗色模式的 RGB 颜色值，RGB 三色用 \`,\` 分隔。

若要设置该颜色值，建议分别设置 \`{{nameLight}}\` 和 \`{{nameDark}}\`。

**示例**：
\`\`\`css
/* 读取自动适配的颜色值 */
.element {
  color: rgb(var({{name}}));
}

/* 读取自动适配的颜色值，并添加不透明度 */
.element {
  color: rgba(var({{name}}), 0.5);
}

/* 分别设置亮色模式、暗色模式的颜色值 */
:root {
  {{nameLight}}: 255, 0, 0;
  {{nameDark}}: 255, 0, 0;
}
\`\`\`
`,
  },
  elevation: {
    description: `Level {{value}} 级别的高度对应的阴影值。

**示例**：
\`\`\`css
/* 设置 level{{value}} 级别的高度对应的阴影值 */
:root {
  {{name}}: 0 0.5px 1.5px 0 rgba(0, 0, 0, 0.19);
}

/* 读取 level{{value}} 级别的高度对应的阴影值 */
.element {
  box-shadow: var({{name}});
}
\`\`\`
`,
  },
  easing: {
    linear: '线性动画',
    standard: '标准动画',
    'standard-accelerate': '标准加速动画',
    'standard-decelerate': '标准减速动画',
    emphasized: '强调动画',
    'emphasized-accelerate': '强调加速动画',
    'emphasized-decelerate': '强调减速动画',
    description: `{{easingName}}的缓动曲线。

**示例**：
\`\`\`css
/* 设置{{easingName}}的缓动曲线 */
:root {
  {{name}}: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 读取{{easingName}}的缓动曲线 */
.element {
  transition-timing-function: var({{name}});
}
\`\`\`
`,
  },
  duration: {
    description: `{{value}}{{level}} 动画的持续时间。

**示例**：
\`\`\`css
/* 设置 {{value}}{{level}} 动画的持续时间 */
:root {
  {{name}}: 0.3s;
}

/* 读取 {{value}}{{level}} 动画的持续时间 */
.element {
  transition-duration: var({{name}});
}
\`\`\`
`,
  },
  corner: {
    description: `{{value}} 级别的圆角值。

**示例**：
\`\`\`css
/* 设置 {{value}} 级别的圆角值 */
:root {
  {{name}}: 4px;
}

/* 读取 {{value}} 级别的圆角值 */
.element {
  border-radius: var({{name}});
}
\`\`\`
`,
  },
  stateLayer: {
    description: `\`{{state}}\` 状态的状态层不透明度。

**示例**：
\`\`\`css
/* 设置 {{state}} 状态的状态层不透明度 */
:root {
  {{name}}: 0.1;
}
\`\`\`
`,
  },
  typescale: {
    font: {
      weight: '字重',
      'line-height': '行高',
      size: '字体大小',
      tracking: '字间距',
    },
    description: `{{styleName}}。

**示例**：
\`\`\`css
/* 设置 {{styleName}} */
:root {
  {{name}}: {{setValue}};
}

/* 读取 {{styleName}} */
.element {
  {{cssPropertyName}}: var({{name}});
}
\`\`\`
`,
  },
};

// 全局 CSS class
originJson.cssClasses = {
  'mdui-theme-light': {
    description:
      '将此 class 添加到元素上，该元素及其子元素将使用亮色模式显示。',
    example: `\`\`\`html
<div class="mdui-theme-light"></div>
\`\`\``,
  },
  'mdui-theme-dark': {
    description:
      '将此 class 添加到 `<html>` 元素上，整个页面将使用暗色模式显示。也可以添加到其他元素上，使该元素及其子元素使用暗色模式显示。',
    example: `\`\`\`html
<!-- 整个页面使用暗色模式显示 -->
<html class="mdui-theme-dark"></html>

<!-- 该元素及其子元素使用暗色模式显示 -->
<div class="mdui-theme-dark"></div>
\`\`\``,
  },
  'mdui-theme-auto': {
    description:
      '将此 class 添加到 `<html>` 上，整个页面将根据操作系统设置自动切换亮色模式和暗色模式。也可添加到其他元素上，使该元素及其子元素自动切换亮色模式和暗色模式。',
    example: `\`\`\`html
<!-- 整个页面自动切换亮色模式和暗色模式 -->
<html class="mdui-theme-auto"></html>

<!-- 该元素及其子元素自动切换亮色模式和暗色模式 -->
<div class="mdui-theme-auto"></div>
\`\`\``,
  },
  'mdui-prose': {
    description: '添加此 class，将优化文章的排版样式。',
    example: `\`\`\`html
<div class="mdui-prose">
  <h1>文章标题</h2>
  <p>文章正文</p>
</div>
\`\`\``,
  },
  'mdui-table': {
    description: `在 \`<table>\` 元素上添加此 class，将优化表格的显示样式。

也可以添加在 \`<table>\` 的父元素上，除了优化表格显示样式外，还支持表格横向滚动`,
    example: `\`\`\`html
<table class="mdui-table"></table>

<div class="mdui-table">
  <table></table>
</div>
\`\`\``,
  },
};

// zh-cn.json 直接全量写入
fs.writeFileSync(
  `./docs/zh-cn.json`,
  JSON.stringify(originJson, null, 2) + '\n',
  'utf-8',
);

// 更新目标语言文件
const updateJson = (targetJson: I18nData, originJson: I18nData) => {
  // 递归，移除多余的属性
  for (const key in targetJson) {
    if (originJson.hasOwnProperty(key)) {
      if (Array.isArray(targetJson[key]) || Array.isArray(originJson[key])) {
        targetJson[key] = originJson[key];
      } else if (
        typeof targetJson[key] === 'object' &&
        typeof originJson[key] === 'object'
      ) {
        updateJson(targetJson[key], originJson[key]);
      }
    } else {
      delete targetJson[key];
    }
  }

  // 添加新增的属性
  for (const key in originJson) {
    if (!targetJson.hasOwnProperty(key)) {
      targetJson[key] = originJson[key];
    }
  }

  // 确保属性顺序一致
  const orderedData: I18nData = {};
  Object.keys(originJson).forEach((key) => {
    if (key in targetJson) {
      orderedData[key] = targetJson[key];
    }
  });

  // 更新属性顺序
  for (const key in targetJson) {
    delete targetJson[key];
  }
  Object.assign(targetJson, orderedData);
};

// 其他语言的 json 文件，只写入新增的文案
languages.forEach((lang) => {
  const langJsonPath = `./docs/${lang}.json`;
  const targetJson: I18nData = JSON.parse(
    fs.readFileSync(langJsonPath, 'utf-8'),
  );

  updateJson(targetJson, originJson);

  fs.writeFileSync(
    langJsonPath,
    JSON.stringify(targetJson, null, 2) + '\n',
    'utf-8',
  );
});
