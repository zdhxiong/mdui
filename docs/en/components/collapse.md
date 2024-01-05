Collapse panels are utilized to group and conceal complex content areas, enhancing page organization.

The collapse panel component does not come with styles. You must either create your own styles or use it in conjunction with other components.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/collapse.js';
import 'mdui/components/collapse-item.js';
```

Import the TypeScript type:

```ts
import type { Collapse } from 'mdui/components/collapse.js';
import type { CollapseItem } from 'mdui/components/collapse-item.js';
```

Example:

```html,example
<mdui-collapse>
  <mdui-collapse-item header="first header">first content</mdui-collapse-item>
  <mdui-collapse-item header="second header">second content</mdui-collapse-item>
</mdui-collapse>
```

## Examples {#examples}

### Panel Header and Content {#example-header}

You can set the panel header text using the `header` attribute of the `<mdui-collapse-item>` component. Alternatively, use the `header` slot to specify the panel header element. The default slot of the component is for the panel content.

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

### Accordion Mode {#example-accordion}

To enable accordion mode, add the `accordion` attribute to the `<mdui-collapse>` component. In this mode, only one panel can be open at a time.

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

### Setting the Active Panel {#example-value}

The `value` attribute of the `<mdui-collapse>` component can be used to get the currently open panel or set the panel you want to open.

In accordion mode, `value` is a string and can be manipulated using either attribute or property. In non-accordion mode, `value` is an array and can only be manipulated using JavaScript property.

```html,example,expandable
<mdui-list>
  <mdui-list-subheader>Accordion Mode</mdui-list-subheader>
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

  <mdui-list-subheader>Non-Accordion Mode</mdui-list-subheader>
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

### Disabled State {#example-disabled}

To disable the entire collapse panel group, add the `disabled` attribute to the `<mdui-collapse>` component. To disable a specific collapse panel, add the `disabled` attribute to the `<mdui-collapse-item>`.

```html,example,expandable
<mdui-list>
  <mdui-list-subheader>All Disabled</mdui-list-subheader>
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

  <mdui-list-subheader>Disable the First Panel</mdui-list-subheader>
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

### Triggering Element for Collapse {#example-trigger}

By default, clicking the entire panel header area triggers the collapse. You can specify the triggering element by using the `trigger` attribute of the `<mdui-collapse-item>` component. The `trigger` attribute can be a CSS selector or a DOM element.

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
