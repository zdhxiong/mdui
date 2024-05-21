mdui can be installed via npm or directly included from a CDN. The recommended method is npm.

## Install via npm {#npm}

```bash
npm install mdui --save
```

### Full Import {#full-import}

To utilize all mdui components, import the following two files in your project's entry file:

```js
import 'mdui/mdui.css';
import 'mdui';
```

You can also import specific functions from mdui. For example, to import the [`snackbar`](/en/docs/2/functions/snackbar) function:

```js
import { snackbar } from 'mdui';
```

<mdui-collapse>
  <mdui-collapse-item>
    <mdui-button slot="header" variant="text">List all importable functions from mdui</mdui-button>
    <pre class="language-js"><code>import {
  $,
  dialog,
  alert,
  confirm,
  prompt,
  snackbar,
  getTheme,
  setTheme,
  getColorFromImage,
  setColorScheme,
  removeColorScheme,
  loadLocale,
  setLocale,
  getLocale,
  throttle,
  observeResize,
  breakpoint
} from 'mdui';</code></pre>
  </mdui-collapse-item>
</mdui-collapse>

### Cherry-picking Import {#cherry-picking}

To optimize your project size, import only the necessary components and functions. For example, if you only need the [`<mdui-button>`](/en/docs/2/components/button) component and [`snackbar`](/en/docs/2/functions/snackbar) function, import them as follows:

```js
// Always import the CSS file
import 'mdui/mdui.css';
// Import the <mdui-button> component
import 'mdui/components/button.js';
// Import the snackbar function
import { snackbar } from 'mdui/functions/snackbar.js';
```

Each component or function documentation page provides details on how to cherry-pick imports.

<mdui-collapse>
  <mdui-collapse-item>
    <mdui-button slot="header" variant="text">List all components and functions supported for cherry-picking import</mdui-button>
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
import { getLocale } from 'mdui/functions/getLocale.js';
import { getTheme } from 'mdui/functions/getTheme.js';
import { loadLocale } from 'mdui/functions/loadLocale.js';
import { observeResize } from 'mdui/functions/observeResize.js';
import { prompt } from 'mdui/functions/prompt.js';
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import { setLocale } from 'mdui/functions/setLocale.js';
import { setTheme } from 'mdui/functions/setTheme.js';
import { snackbar } from 'mdui/functions/snackbar.js';
import { throttle } from 'mdui/functions/throttle.js';</code></pre>
  </mdui-collapse-item>
</mdui-collapse>

## CDN {#cdn}

mdui can also be included directly via a CDN using `<link>` and `<script>` tags. Alternatively, you can download the CSS and JavaScript files for server deployment. Once included, all mdui components are available for use.

### Global Build {#global-build}

The global build of mdui exposes all functions as properties on the global `mdui` object.

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>

<mdui-button class="btn">Click me</mdui-button>

<script>
  document.querySelector('.btn').addEventListener('click', () => {
    mdui.snackbar({ message: 'Button clicked' });
  });
</script>
```

### ES Module Build {#es-module}

The ES module build of mdui allows you to import it using ES module syntax from the CDN.

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">

<mdui-button class="btn">Click me</mdui-button>

<script>
  import { snackbar } from 'https://unpkg.com/mdui@2/mdui.esm.js';

  document.querySelector('.btn').addEventListener('click', () => {
    snackbar({ message: 'Button clicked' });
  });
</script>
```
