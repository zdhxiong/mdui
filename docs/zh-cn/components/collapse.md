折叠面板组件用于将复杂的内容区域进行分组和隐藏，以保持页面的整洁。

请注意，折叠面板组件本身不包含任何样式，你需要自行添加样式，或者与其他组件一起使用。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Collapse } from 'mdui/components/collapse.js';
import type { CollapseItem } from 'mdui/components/collapse-item.js';
```

使用示例：

```html,example
<mdui-collapse>
  <mdui-collapse-item header="first header">first content</mdui-collapse-item>
  <mdui-collapse-item header="second header">second content</mdui-collapse-item>
</mdui-collapse>
```

## 示例 {#examples}

### 面板标题与内容 {#example-header}

通过 `<mdui-collapse-item>` 组件的 `header` 属性可以设置面板头部的文本，也可以通过 `header` slot 来指定面板头部元素。组件的 default slot 用于面板内容。

```html,example,expandable
<mdui-list>
  <mdui-collapse>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>
</mdui-list>
```

### 手风琴模式 {#example-accordion}

在 `<mdui-collapse>` 组件上添加 `accordion` 属性可以启用手风琴模式，这样一次只会有一个面板处于打开状态。

```html,example,expandable
<mdui-list>
  <mdui-collapse accordion>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>
</mdui-list>
```

### 设置激活的面板 {#example-value}

通过 `<mdui-collapse>` 组件的 `value` 属性，你可以获取当前打开的面板，或设置需要打开的面板。

在手风琴模式下，`value` 属性的值为字符串，你可以使用 HTML 属性或 JavaScript 属性来操作该属性；在非手风琴模式下，`value` 属性的值为数组，此时只能通过 JavaScript 属性进行操作。

```html,example,expandable
<mdui-list>
  <mdui-list-subheader>手风琴模式</mdui-list-subheader>
  <mdui-collapse accordion value="item-1">
    <mdui-collapse-item value="item-1">
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item value="item-2">
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>

  <mdui-list-subheader>非手风琴模式</mdui-list-subheader>
  <mdui-collapse class="example-value">
    <mdui-collapse-item value="item-1">
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item value="item-2">
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>
</mdui-list>

<script>
  const collapse = document.querySelector(".example-value");
  collapse.value = ["item-1", "item-2"];
</script>
```

### 禁用状态 {#example-disabled}

通过在 `<mdui-collapse>` 组件上添加 `disabled` 属性，可以禁用整个折叠面板组。同样，通过在 `<mdui-collapse-item>` 组件上添加 `disabled` 属性，可以禁用特定的折叠面板。

```html,example,expandable
<mdui-list>
  <mdui-list-subheader>全部禁用</mdui-list-subheader>
  <mdui-collapse disabled>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>

  <mdui-list-subheader>禁用第一个面板</mdui-list-subheader>
  <mdui-collapse>
    <mdui-collapse-item disabled>
      <mdui-list-item slot="header" icon="near_me">Item 1</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
    <mdui-collapse-item>
      <mdui-list-item slot="header" icon="near_me">Item 2</mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 2 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>
</mdui-list>
```

### 触发折叠的元素 {#example-trigger}

默认情况下，点击整个面板头部区域会触发折叠。你可以通过设置 `<mdui-collapse-item>` 组件的 `trigger` 属性来指定触发折叠的元素。`trigger` 属性可以是 CSS 选择器或 DOM 元素。

```html,example,expandable
<mdui-list>
  <mdui-collapse>
    <mdui-collapse-item trigger=".example-trigger">
      <mdui-list-item slot="header" icon="near_me">
        Item 1
        <mdui-icon slot="end-icon" class="example-trigger" name="keyboard_arrow_down"></mdui-icon>
      </mdui-list-item>
      <div style="margin-left: 2.5rem">
        <mdui-list-item>Item 1 - subitem</mdui-list-item>
      </div>
    </mdui-collapse-item>
  </mdui-collapse>
</mdui-list>
```
