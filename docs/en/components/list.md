A List is a vertical arrangement of items that can contain text or images.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
```

Import the TypeScript type:

```ts
import type { List } from 'mdui/components/list.js';
import type { ListItem } from 'mdui/components/list-item.js';
import type { ListSubheader } from 'mdui/components/list-subheader.js';
```

Example:

```html,example
<mdui-list>
  <mdui-list-subheader>Subheader</mdui-list-subheader>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

## Examples {#examples}

### Text Content {#example-text}

The `headline` attribute on `<mdui-list-item>` sets the primary text, while the `description` attribute sets the secondary text.

```html,example,expandable
<mdui-list>
  <mdui-list-item headline="Headline"></mdui-list-item>
  <mdui-list-item headline="Headline" description="Supporting text"></mdui-list-item>
</mdui-list>
```

Alternatively, use the default slot for the primary text and the `description` slot for the secondary text.

```html,example,expandable
<mdui-list>
  <mdui-list-item>Headline</mdui-list-item>
  <mdui-list-item>
    Headline
    <span slot="description">Supporting text</span>
  </mdui-list-item>
</mdui-list>
```

By default, both primary and secondary text are displayed in full. To limit the number of lines, use the `headline-line` and `description-line` attributes. The maximum limit is `3` lines.

```html,example,expandable
<mdui-list>
  <mdui-list-item headline-line="1" description-line="2">
    Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline
    <span slot="description">Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text</span>
  </mdui-list-item>
</mdui-list>
```

### Side Content {#example-side}

The `icon` and `end-icon` attributes on `<mdui-list-item>` add Material Icons to the left and right sides, respectively.

```html,example,expandable
<mdui-list>
  <mdui-list-item icon="people" end-icon="arrow_right">Headline</mdui-list-item>
</mdui-list>
```

Alternatively, use the `icon` and `end-icon` slots to add elements to the left and right sides of the list item.

```html,example,expandable
<mdui-list>
  <mdui-list-item>
    Headline
    <mdui-avatar slot="icon" src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
    <mdui-checkbox slot="end-icon"></mdui-checkbox>
  </mdui-list-item>
</mdui-list>
```

### Link {#example-link}

The `href` attribute turns the list into a link, with `download`, `target`, and `rel` attributes available for link-related functionality.

```html,example,expandable
<mdui-list>
  <mdui-list-item href="https://www.mdui.org" target="_blank">Headline</mdui-list-item>
</mdui-list>
```

### Disabled State {#example-disabled}

The `disabled` attribute on `<mdui-list-item>` disables the item. This also disables components within the list item.

```html,example,expandable
<mdui-list>
  <mdui-list-item disabled>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### Active State {#example-active}

The `active` attribute on `<mdui-list-item>` activates the item.

```html,example,expandable
<mdui-list>
  <mdui-list-item active>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### Nonclickable State {#example-nonclickable}

The `nonclickable` attribute on `<mdui-list-item>` removes mouse hover and click ripple effects.

```html,example,expandable
<mdui-list>
  <mdui-list-item nonclickable>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### Rounded Shape {#example-rounded}

The `rounded` attribute on `<mdui-list-item>` gives the item a rounded appearance.

```html,example,expandable
<mdui-list>
  <mdui-list-item rounded>Headline</mdui-list-item>
  <mdui-list-item rounded>Headline</mdui-list-item>
</mdui-list>
```

### Vertical Alignment {#example-alignment}

The `alignment` attribute on `<mdui-list-item>` aligns elements on the left and right. Possible values:

* `start`: top alignment.
* `center`: center alignment.
* `end`: bottom alignment.

```html,example,expandable
<mdui-list>
  <mdui-list-item alignment="start" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
  <mdui-list-item alignment="center" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
  <mdui-list-item alignment="end" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
</mdui-list>
```

### Custom Content {#example-custom}

The `custom` slot in `<mdui-list-item>` allows for full customization of the list item content.

```html,example,expandable
<mdui-list>
  <mdui-list-item>
    <div slot="custom" style="display: flex;">
      <mdui-icon name="people"></mdui-icon>
      <div>test</div>
    </div>
  </mdui-list-item>
</mdui-list>
```
