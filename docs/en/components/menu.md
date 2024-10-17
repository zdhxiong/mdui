Menus display a list of choices on a temporary surface. They appear when users interact with a button, action, or other control.

For dropdown menus, utilize the [`<mdui-dropdown>`](/en/docs/2/components/dropdown) component.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';
```

Import the TypeScript type:

```ts
import type { Menu } from 'mdui/components/menu.js';
import type { MenuItem } from 'mdui/components/menu-item.js';
```

Example:

```html,example
<mdui-menu>
  <mdui-menu-item>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
</mdui-menu>
```

## Examples {#examples}

### Dropdown Menu {#example-dropdown}

To create a dropdown menu, use the [`<mdui-dropdown>`](/en/docs/2/components/dropdown) component.

```html,example,expandable
<mdui-dropdown>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### Dense Style {#example-dense}

For a dense menu style, add the `dense` attribute to `<mdui-menu>`.

```html,example,expandable
<mdui-menu dense>
  <mdui-menu-item>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### Disabled Items {#example-disabled}

To disable menu items, add the `disabled` attribute to `<mdui-menu-item>`.

```html,example,expandable
<mdui-menu>
  <mdui-menu-item disabled>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### Single Selection {#example-selects-single}

For single selection, set the `selects` attribute to `single` on `<mdui-menu>`. The `value` of `<mdui-menu>` is the `value` of the selected `<mdui-menu-item>`.

```html,example,expandable
<mdui-menu selects="single" value="item-2">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-menu>
```

### Multiple Selection {#example-selects-multiple}

For multiple selection, set the `selects` attribute to `multiple` on `<mdui-menu>`. The `value` of `<mdui-menu>` is an array of the selected `<mdui-menu-item>` values.

Note: For multiple selection, the `value` of `<mdui-menu>` is an array and can only be read and set via JavaScript property.

```html,example,expandable
<mdui-menu selects="multiple" class="example-multiple">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-menu-item value="item-3">Item 3</mdui-menu-item>
</mdui-menu>

<script>
  // Set default selection to item-1 and item-2
  const menu = document.querySelector(".example-multiple");
  menu.value = ["item-1", "item-2"];
</script>
```

### Icons {#example-icon}

To add Material Icons on the left and right, add `icon`, `end-icon` attributes to `<mdui-menu-item>`. Use `end-text` attribute to add text on the right side. Alternatively, use `icon`, `end-icon`, `end-text` slots for the same purpose.

Setting `icon` attribute to an empty string creates space for an icon on the left, aligning it with other items.

```html,example,expandable
<mdui-menu>
  <mdui-menu-item icon="visibility" end-icon="add_circle" end-text="Ctrl+X">Item 1</mdui-menu-item>
  <mdui-menu-item>
    Item 2
    <mdui-icon slot="icon" name="visibility"></mdui-icon>
    <mdui-icon slot="end-icon" name="add_circle"></mdui-icon>
    <span slot="end-text">Ctrl+X</span>
  </mdui-menu-item>
  <mdui-menu-item icon="">Item 3</mdui-menu-item>
</mdui-menu>
```

For single or multiple selection, use `selected-icon` attribute or `selected-icon` slot to define the icon for selected state.

```html,example,expandable
<mdui-menu selects="multiple">
  <mdui-menu-item value="item-1" selected-icon="cloud_done">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">
    <mdui-icon slot="selected-icon" name="done_outline"></mdui-icon>
    Item 2
  </mdui-menu-item>
</mdui-menu>
```

### Link {#example-link}

To turn the menu item into a link, use the `href` attribute on the `<mdui-menu-item>` component. `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-menu>
  <mdui-menu-item href="https://www.mdui.org" target="_blank">Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
</mdui-menu>
```

### Submenu {#example-submenu}

To specify submenu items, use the `submenu` slot within `<mdui-menu-item>`.

```html,example,expandable
<mdui-menu>
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

Set `submenu-trigger` attribute on `<mdui-menu>` to define the trigger method for the submenu.

```html,example,expandable
<mdui-menu submenu-trigger="click">
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

When `submenu-trigger="hover"` is set, use `submenu-open-delay` and `submenu-close-delay` attributes on `<mdui-menu>` to set the delay for opening and closing the submenu.

```html,example,expandable
<mdui-menu submenu-trigger="hover" submenu-open-delay="1000" submenu-close-delay="1000">
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

### Custom Content {#example-custom}

To fully customize the menu item content, use the `custom` slot in `<mdui-menu-item>`.

```html,example,expandable
<style>
  .custom-item {
    padding: 4px 12px;
  }

  .custom-item .secondary {
    display: none;
    color: #888;
    font-size: 13px;
  }

  .custom-item:hover .secondary {
    display: block
  }
</style>

<mdui-menu>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ABS</div>
      <div class="secondary">Absolute value of the number</div>
    </div>
  </mdui-menu-item>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ACOS</div>
      <div class="secondary">Arc cosine of the number, in radians</div>
    </div>
  </mdui-menu-item>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ACOSH</div>
      <div class="secondary">Inverse hyperbolic cosine of the number</div>
    </div>
  </mdui-menu-item>
</mdui-menu>
```
