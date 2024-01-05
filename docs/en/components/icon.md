The Icon component represents common actions and supports both Material Icons and SVG icons.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/icon.js';
```

Import the TypeScript type:

```ts
import type { Icon } from 'mdui/components/icon.js';
```

Example:

```html,example
<mdui-icon name="search"></mdui-icon>
```

### Using Material Icons {#usage-material-icons}

To use Material Icons, import the CSS file for the desired variant: Filled, Outlined, Rounded, Sharp, or Two Tone.

```html
<!-- Filled -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Outlined -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

<!-- Rounded -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

<!-- Sharp -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet">

<!-- Two Tone -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone" rel="stylesheet">
```

Use the `name` attribute to specify the icon, appending the variant name as a suffix (no suffix needed for Filled). Here's how to use the `delete` icon in all 5 variants:

```html,example
<!-- Filled -->
<mdui-icon name="delete"></mdui-icon>

<!-- Outlined -->
<mdui-icon name="delete--outlined"></mdui-icon>

<!-- Rounded -->
<mdui-icon name="delete--rounded"></mdui-icon>

<!-- Sharp -->
<mdui-icon name="delete--sharp"></mdui-icon>

<!-- Two Tone -->
<mdui-icon name="delete--two-tone"></mdui-icon>
```

Search for icons directly using the [Material Icons Search](/en/docs/2/components/icon#search) tool at the page bottom. Click an icon to copy its code to the clipboard.

mdui also provides a standalone package [`@mdui/icons`](/en/docs/2/libraries/icons), with each icon component as a separate file. This allows importing only needed icon components, without the entire icon library.

### Using SVG Icon {#usage-svg}

The component supports SVG icons. Pass the SVG icon link to the `src` attribute:

```html,example
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg"></mdui-icon>
```

Or, pass the SVG content directly into the component's default slot:

```html,example
<mdui-icon>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
</mdui-icon>
```

## Examples {#examples}

### Set Color {#example-color}

Change the icon color by setting the `color` CSS style of the `<mdui-icon>` element or its parent.

```html,example,expandable
<mdui-icon name="delete" style="color: red"></mdui-icon>
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg" style="color: red"></mdui-icon>
```

### Set Size {#example-size}

Change the icon size by setting the `font-size` CSS style of the `<mdui-icon>` element or its parent.

```html,example,expandable
<mdui-icon name="delete" style="font-size: 32px"></mdui-icon>
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg" style="font-size: 32px"></mdui-icon>
```
