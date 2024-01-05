Tooltips provide supplementary text information for a specific element, enhancing the comprehension of its function or purpose.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/tooltip.js';
```

Import the TypeScript type:

```ts
import type { Tooltip } from 'mdui/components/tooltip.js';
```

Example:

```html,example
<mdui-tooltip content="Plain tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```

## Examples {#examples}

### Plain Text Tooltip {#example-plain}

By default, the tooltip displays plain text. The `content` attribute specifies the tooltip content.

```html,example,expandable
<mdui-tooltip content="Plain tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```

Alternatively, the `content` slot can also be used for this purpose.

```html,example,expandable
<mdui-tooltip>
  <mdui-button>button</mdui-button>
  <div slot="content">
    <div style="font-size: 1.4em">title</div>
    <div>content</div>
  </div>
</mdui-tooltip>
```

### Rich Text Tooltip {#example-rich}

For a rich text tooltip, set the `variant` attribute to `rich`. The tooltip's title and content can be specified using the `headline` and `content` attributes, respectively.

```html,example,expandable
<mdui-tooltip
  variant="rich"
  headline="Rich tooltip"
  content="Rich tooltips bring attention to a particular element of feature that warrants the user's focus. It supports multiple lines of informational text."
>
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```

Alternatively, the `headline` and `content` slots can be used to specify the tooltip's title and content. The `action` slot is used to specify the tooltip's action button.

```html,example,expandable
<mdui-tooltip variant="rich">
  <mdui-button>button</mdui-button>
  <div slot="headline">Rich tooltip</div>
  <div slot="content">Rich tooltips bring attention to a particular element of feature that warrants the user's focus. It supports multiple lines of informational text.</div>
  <mdui-button slot="action" variant="text">Action</mdui-button>
</mdui-tooltip>
```

### Placement {#example-placement}

The `placement` attribute sets the tooltip's position.

```html,example,expandable
<div class="example-placement">
  <div class="row">
    <mdui-tooltip placement="top-left" content="top-left">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="top-start" content="top-start">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="top" content="top">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="top-end" content="top-end">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="top-right" content="top-right">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
  </div>
  <div class="row">
    <mdui-tooltip placement="left-start" content="left-start">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="right-start" content="right-start">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
  </div>
  <div class="row">
    <mdui-tooltip placement="left" content="left">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="right" content="right">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
  </div>
  <div class="row">
    <mdui-tooltip placement="left-end" content="left-end">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="right-end" content="right-end">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
  </div>
  <div class="row">
    <mdui-tooltip placement="bottom-left" content="bottom-left">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="bottom-start" content="bottom-start">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="bottom" content="bottom">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="bottom-end" content="bottom-end">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
    <mdui-tooltip placement="bottom-right" content="bottom-right">
      <mdui-card variant="outlined"></mdui-card>
    </mdui-tooltip>
  </div>
</div>

<style>
.example-placement mdui-card {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0.25rem;
}

.example-placement .row:nth-child(2) mdui-tooltip:last-child mdui-card,
.example-placement .row:nth-child(3) mdui-tooltip:last-child mdui-card,
.example-placement .row:nth-child(4) mdui-tooltip:last-child mdui-card {
  margin-left: 10rem;
}
</style>
```

### Trigger Method {#example-trigger}

The `trigger` attribute determines the trigger method for the tooltip.

```html,example,expandable
<mdui-tooltip trigger="click" content="tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```

### Open/Close Delay {#example-delay}

When the trigger method is `hover`, the `open-delay` and `close-delay` attributes set the opening and closing delays, respectively. The unit is in milliseconds.

```html,example,expandable
<mdui-tooltip open-delay="1000" close-delay="1000" content="tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```

### Disabled State {#example-disabled}

The `disabled` attribute disables the tooltip.

```html,example,expandable
<mdui-tooltip disabled content="tooltip">
  <mdui-button>button</mdui-button>
</mdui-tooltip>
```
