你可以选择通过 npm 安装 mdui，或者从 CDN 引入 mdui。推荐使用 npm 进行安装。

## npm 安装 {#npm}

```bash
npm install mdui --save
```

### 全量导入 {#full-import}

在项目的入口文件中导入下面两个文件，即可使用所有 mdui 组件：

```js
import 'mdui/mdui.css';
import 'mdui';
```

也可以直接从 mdui 导入需要使用的函数。例如，要导入 [`snackbar`](/zh-cn/docs/2/functions/snackbar) 函数，可以这样做：

```js
import { snackbar } from 'mdui';
```

<mdui-collapse>
  <mdui-collapse-item>
    <a slot="header" href="">显示所有支持从 mdui 导入的函数</a>
    <pre class="language-js"><code>import {
  $,
  alert,
  confirm,
  prompt,
  snackbar,
  getTheme,
  setTheme,
  getColorFromImage,
  setColorScheme,
  removeColorScheme,
  throttle,
  observeResize,
  breakpoint
} from 'mdui';</code></pre>
  </mdui-collapse-item>
</mdui-collapse>

### 按需导入 {#cherry-picking}

为了优化项目体积，可以仅导入需要的组件和函数。例如，如果你只需要使用 [`<mdui-button>`](/zh-cn/docs/2/components/button) 组件和 [`snackbar`](/zh-cn/docs/2/functions/snackbar) 函数，可以按照以下方式导入：

```js
// CSS 文件始终需要导入
import 'mdui/mdui.css';
// 导入 <mdui-button> 组件
import 'mdui/components/button.js';
// 导入 snackbar 函数
import { snackbar } from 'mdui/functions/snackbar.js';
```

每个组件或函数的文档页面都会详细说明如何进行按需导入。

<mdui-collapse>
  <mdui-collapse-item>
    <a slot="header" href="">显示所有支持按需导入的组件和函数</a>
    <pre class="language-js"><code>import 'mdui/components/avatar.js';
import 'mdui/components/badge.js';
import 'mdui/components/bottom-app-bar.js';
import 'mdui/components/button.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/checkbox.js';
import 'mdui/components/chip.js';
import 'mdui/components/circular-progress.js';
import 'mdui/components/collapse/collapse.js';
import 'mdui/components/collapse/collapse-item.js';
import 'mdui/components/dialog.js';
import 'mdui/components/divider.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/fab.js';
import 'mdui/components/icon.js';
import 'mdui/components/layout.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
import 'mdui/components/linear-progress.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
import 'mdui/components/list.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/menu.js';
import 'mdui/components/navigation-bar-item.js';
import 'mdui/components/navigation-bar.js';
import 'mdui/components/navigation-drawer.js';
import 'mdui/components/navigation-rail.js';
import 'mdui/components/navigation-rail-item.js';
import 'mdui/components/radio.js';
import 'mdui/components/radio-group.js';
import 'mdui/components/range-slider.js';
import 'mdui/components/ripple.js';
import 'mdui/components/segmented-button.js';
import 'mdui/components/segmented-button-group.js';
import 'mdui/components/select.js';
import 'mdui/components/slider.js';
import 'mdui/components/snackbar.js';
import 'mdui/components/switch.js';
import 'mdui/components/tab.js';
import 'mdui/components/tab-panel.js';
import 'mdui/components/tabs.js';
import 'mdui/components/text-field.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/top-app-bar.js';
import { $ } from 'mdui/jq.js';
import { alert } from 'mdui/functions/alert.js';
import { breakpoint } from 'mdui/functions/breakpoint.js';
import { confirm } from 'mdui/functions/confirm.js';
import { dialog } from 'mdui/functions/dialog.js';
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
import { getTheme } from 'mdui/functions/getTheme.js';
import { observeResize } from 'mdui/functions/observeResize.js';
import { prompt } from 'mdui/functions/prompt.js';
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import { setTheme } from 'mdui/functions/setTheme.js';
import { snackbar } from 'mdui/functions/snackbar.js';
import { throttle } from 'mdui/functions/throttle.js';</code></pre>
  </mdui-collapse-item>
</mdui-collapse>

## CDN {#cdn}

你可以使用 `<link>` 和 `<script>` 标签直接通过 CDN 来使用 mdui。也可以下载 CSS 和 JavaScript 文件并部署在你自己的服务器上。引入 CSS 和 JavaScript 文件后，就能使用所有 mdui 组件了。


### 使用全局构建版本 {#global-build}

下面的例子展示了如何使用全局构建版本的 mdui。在这个版本中，所有的函数都作为属性暴露在全局对象 `mdui` 上：

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>

<mdui-button class="btn">点我</mdui-button>

<script>
  document.querySelector('.btn').addEventListener('click', () => {
    mdui.snackbar({ message: '点击了按钮' });
  });
</script>
```

### 使用 ES 模块构建版本 {#es-module}

下面的例子展示了如何使用 ES 模块构建版本的 mdui。在这个版本中，你可以使用 ES 模块语法从 CDN 导入 mdui：

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">

<mdui-button class="btn">点我</mdui-button>

<script type="module">
  import { snackbar } from 'https://unpkg.com/mdui@2/mdui.esm.js';

  document.querySelector('.btn').addEventListener('click', () => {
    snackbar({ message: '点击了按钮' });
  });
</script>
```
