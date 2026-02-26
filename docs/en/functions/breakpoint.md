# breakpoint Function

The `breakpoint` function checks the current page width against responsive breakpoints.

mdui provides six breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, and `xxl`. Default values are listed on the [Design Tokens](/en/docs/2/styles/design-tokens#breakpoint) page. This function lets you check whether the current page width is above, below, equal to, or different from a specified breakpoint, or within a specified range.

## Usage {#usage}

Import the function:

```js
import { breakpoint } from 'mdui/functions/breakpoint.js';
```

Example:

```js
const breakpointCondition = breakpoint();

// Check if the current page breakpoint is greater than 'sm'
breakpointCondition.up('sm');

// Check if the current page breakpoint is less than 'lg'
breakpointCondition.down('lg');

// Check if the current page breakpoint is equal to 'md'
breakpointCondition.only('md');

// Check if the current page breakpoint is not equal to 'xl'
breakpointCondition.not('xl');

// Check if the current page breakpoint is between 'sm' and 'lg'
breakpointCondition.between('sm', 'lg');
```

## API {#api}

<pre><code class="nohighlight">breakpoint(width?: number | string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): <a href="#api-breakpointCondition">breakpointCondition</a></code></pre>

This function returns a [`breakpointCondition`](#api-breakpointCondition) object. Its behavior depends on the type of argument you pass:

- If no parameter is passed, it returns the `breakpointCondition` for the current page width.
- If a number is passed, it returns the `breakpointCondition` for the specified width.
- If a CSS selector is passed, it returns the `breakpointCondition` for the width of the corresponding element.
- If an HTML element is passed, it returns the `breakpointCondition` for the width of the specified element.
- If a [JQ object](/en/docs/2/functions/jq) is passed, it returns the `breakpointCondition` for the width of the element within the JQ object.

### Breakpoint {#api-Breakpoint}

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
```

### breakpointCondition {#api-breakpointCondition}

<pre><code class="nohighlight">{
  /**
   * Checks if the current width is greater than the specified breakpoint.
   */
  up(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * Checks if the current width is less than the specified breakpoint.
   */
  down(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * Checks if the current width is equal to the specified breakpoint.
   */
  only(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * Checks if the current width is not equal to the specified breakpoint.
   */
  not(breakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;

  /**
   * Checks if the current width is between the specified breakpoints.
   */
  between(startBreakpoint: <a href="#api-Breakpoint">Breakpoint</a>, endBreakpoint: <a href="#api-Breakpoint">Breakpoint</a>): boolean;
}</code></pre>
