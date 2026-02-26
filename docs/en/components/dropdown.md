# Dropdown Component

The Dropdown component shows content in a pop-up menu. It is often used together with the Menu component.

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

```html,example,playgroundId=255
<mdui-dropdown>
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

## Examples {#examples}

### Disabled State {#example-disabled}

Add the `disabled` attribute to disable the dropdown.

```html,example,expandable,playgroundId=256
<mdui-dropdown disabled>
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Placement {#example-placement}

Use the `placement` attribute to control where the dropdown opens.

```html,example,expandable,playgroundId=257
<mdui-dropdown placement="right-start">
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Trigger Method {#example-trigger}

Use the `trigger` attribute to set how the dropdown opens.

```html,example,expandable,playgroundId=258
<mdui-dropdown trigger="hover">
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Open on Pointer {#example-open-on-pointer}

Add the `open-on-pointer` attribute to open the dropdown at the pointer position. It is often paired with `trigger="contextmenu"` to open a context menu on right-click.

```html,example,expandable,playgroundId=259
<mdui-dropdown trigger="contextmenu" open-on-pointer>
  <mdui-card slot="trigger" style="width:100%;height: 80px">Right-click here to open the menu</mdui-card>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Keep Menu Open {#example-stay-open-on-click}

By default, clicking a menu item in the dropdown component closes it. Add `stay-open-on-click` to keep it open.

```html,example,expandable,playgroundId=260
<mdui-dropdown trigger="click" stay-open-on-click>
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Open/Close Delay {#example-delay}

With `trigger="hover"`, use `open-delay` and `close-delay` to set the open and close delays.

```html,example,expandable,playgroundId=261
<mdui-dropdown trigger="hover" open-delay="1000" close-delay="1000">
  <mdui-button slot="trigger">Open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```
