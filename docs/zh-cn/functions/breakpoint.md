该函数用于判断页面的断点。

mdui 提供了 6 个断点，分别为：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`。其默认值可在 [设计令牌](/zh-cn/docs/2/styles/design-tokens#breakpoint) 页面查看。你可以使用此函数来判断页面宽度是否大于、小于、等于、不等于指定的断点，或者是否在指定的断点范围内。

## 使用方法 {#usage}

按需导入函数：

```js
import { breakpoint } from 'mdui/functions/breakpoint.js';
```

使用示例：

```js
const breakpointCondition = breakpoint();

// 判断当前页面断点是否大于 sm
breakpointCondition.up('sm');

// 判断当前页面断点是否小于 lg
breakpointCondition.down('lg');

// 判断当前页面断点是否等于 md
breakpointCondition.only('md');

// 判断当前页面断点是否不等于 xl
breakpointCondition.not('xl');

// 判断当前页面断点是否在 sm 和 lg 之间
breakpointCondition.between('sm', 'lg');
```

## API {#api}

<pre><code class="nohighlight">breakpoint(width?: number | string | HTMLElement | <a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): <a href="#api-breakpointCondition">breakpointCondition</a></code></pre>

该函数返回 [`breakpointCondition`](#api-breakpointCondition) 对象。函数的行为取决于传入的参数类型：

* 如果不传入参数，将返回当前页面宽度的 `breakpointCondition` 对象。
* 如果传入数值，将返回指定宽度的 `breakpointCondition` 对象。
* 如果传入 CSS 选择器，将返回该选择器对应元素宽度的 `breakpointCondition` 对象。
* 如果传入 HTML 元素，将返回该元素宽度的 `breakpointCondition` 对象。
* 如果传入 [JQ 对象](/zh-cn/docs/2/functions/jq)，将返回该 JQ 对象中元素的宽度的 `breakpointCondition` 对象。

### Breakpoint {#api-Breakpoint}

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
```

### breakpointCondition {#api-breakpointCondition}

<pre><code class="nohighlight">{
  /**
   * 当前宽度是否大于指定断点值
   */
  up(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * 当前宽度是否小于指定断点值
   */
  down(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * 当前宽度是否在指定断点值内
   */
  only(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * 当前宽度是否不在指定断点值内
   */
  not(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * 当前宽度是否在指定断点值之间
   */
  between(startBreakpoint: <a href="#api-Breakpoint">Breakpoint</a>, endBreakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;
}</code></pre>
