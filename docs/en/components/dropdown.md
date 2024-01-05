The Dropdown component displays specific content in a pop-up control. It is often used in conjunction with the Menu component.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/dropdown.js';
```

Import the TypeScript type:

```ts
import type { Dropdown } from 'mdui/components/dropdown.js';
```

Example:

```html,example
<mdui-dropdown>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

## Examples {#examples}

### Disabled State {#example-disabled}

Add the `disabled` attribute to disable the dropdown.

```html,example,expandable
<mdui-dropdown disabled>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Open Position {#example-placement}

Set the `placement` attribute to control the dropdown's open position.

```html,example,expandable
<mdui-dropdown placement="right-start">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Trigger Method {#example-trigger}

Set the dropdown's trigger method with the `trigger` attribute.

```html,example,expandable
<mdui-dropdown trigger="hover">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Open on Pointer {#example-open-on-pointer}

Add the `open-on-pointer` attribute to open the dropdown at the pointer location. This is often combined with `trigger="contextmenu"` for right-click menu activation.

```html,example,expandable
<mdui-dropdown trigger="contextmenu" open-on-pointer>
  <mdui-card slot="trigger" style="width:100%;height: 80px">Open the menu here with the right mouse button</mdui-card>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Keep Menu Open {#example-stay-open-on-click}

By default, clicking a menu item in the dropdown component closes it. Add `stay-open-on-click` to keep it open.

```html,example,expandable
<mdui-dropdown trigger="click" stay-open-on-click>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Open/Close Delay {#example-delay}

With `trigger="hover"`, use `open-delay` and `close-delay` to set the open and close delays.

```html,example,expandable
<mdui-dropdown trigger="hover" open-delay="1000" close-delay="1000">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```
