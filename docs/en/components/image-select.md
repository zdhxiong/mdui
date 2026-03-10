# Image Select Component

The image select component allows users to select one or more images from a collection. It displays a check indicator when selected. Use it with `<mdui-image-select-group>` for managing selection state across multiple items.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/image-select.js';
import 'mdui/components/image-select-group.js';
```

Import the TypeScript type:

```ts
import type { ImageSelect } from 'mdui/components/image-select.js';
import type { ImageSelectGroup } from 'mdui/components/image-select-group.js';
```

Example:

```html,example
<mdui-image-select-group selects="multiple">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

## Examples {#examples}

### Standalone Usage {#example-standalone}

The `<mdui-image-select>` component can be used independently without a group. Click to toggle the selected state.

```html,example,expandable
<mdui-image-select src="https://via.placeholder.com/200" style="width: 200px; height: 200px"></mdui-image-select>
```

### Multiple Selection {#example-selects-multiple}

Set the `selects` attribute of `<mdui-image-select-group>` to `multiple` (default) to enable multiple selection mode. In this mode, the `value` property of `<mdui-image-select-group>` is an array of the `value` properties of the currently selected items.

Note: In multiple selection mode, the `value` property is an array and can only be read and set through JavaScript.

```html,example,expandable
<mdui-image-select-group selects="multiple">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

### Single Selection {#example-selects-single}

Set the `selects` attribute to `single` for single selection mode. In this mode, the `value` property of `<mdui-image-select-group>` reflects the `value` of the currently selected item.

```html,example,expandable
<mdui-image-select-group selects="single">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

### Grid Columns {#example-columns}

Use the `--columns` CSS custom property on `<mdui-image-select-group>` to control the number of grid columns. The default is `3`.

```html,example,expandable
<mdui-image-select-group selects="multiple" style="--columns: 4">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="4"></mdui-image-select>
</mdui-image-select-group>
```

### Image Fit {#example-fit}

Use the `fit` attribute to control how the image fits within the container. Possible values are `contain`, `cover` (default), `fill`, `none`, and `scale-down`.

```html,example,expandable
<mdui-image-select src="https://via.placeholder.com/400x200" fit="contain" style="width: 200px; height: 200px"></mdui-image-select>
<mdui-image-select src="https://via.placeholder.com/400x200" fit="cover" style="width: 200px; height: 200px"></mdui-image-select>
<mdui-image-select src="https://via.placeholder.com/400x200" fit="fill" style="width: 200px; height: 200px"></mdui-image-select>
```

### Custom Content {#example-slot}

Use the default slot to provide custom content instead of the `src` attribute.

```html,example,expandable
<mdui-image-select style="width: 200px; height: 200px">
  <img src="https://via.placeholder.com/200" alt="Custom image" style="width: 100%; height: 100%; object-fit: cover" />
</mdui-image-select>
```

### Disabled State {#example-disabled}

Add the `disabled` attribute to `<mdui-image-select-group>` to disable all items, or add it to individual `<mdui-image-select>` elements to disable specific items.

```html,example,expandable
<mdui-image-select-group selects="multiple" disabled>
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```
