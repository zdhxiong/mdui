该函数用于进行页面断点的判断。

mdui 共包含 6 个断点，分别为：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`，其默认值可见 [设计令牌](/docs/2/styles/design-tokens#breakpoint) 页面。可通过该函数判断页面宽度是否大于、小于、等于、不等于指定断点，及是否在指定断点范围内。

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

<pre><code class="nohighlight">breakpoint(width?: number | string | HTMLElement | <a href="/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): <a href="#api-breakpointCondition">breakpointCondition</a></code></pre>

若不传入参数，则返回当前页面宽度的断点判断对象。

若传入数值，则返回指定宽度的断点判断对象。

若传入 CSS 选择器，则返回该选择器对应的元素宽度的断点判断对象。

若传入 HTML 元素，则返回指定元素宽度的断点判断对象。

若传入 <a href="/docs/2/functions/jq">JQ 对象</a>，则返回该 JQ 对象中的元素宽度的断点判断对象。

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
