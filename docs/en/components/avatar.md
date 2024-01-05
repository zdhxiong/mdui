Avatars represent users or entities by displaying images, icons, or characters.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/avatar.js';
```

Import the TypeScript type:

```ts
import type { Avatar } from 'mdui/components/avatar.js';
```

Example:

```html,example
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
```

## Examples {#examples}

### Image Avatar {#example-src}

To use an image as the avatar, specify the image link using the `src` attribute, or provide an `<img>` element within the default slot.

```html,example,expandable
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>

<mdui-avatar>
  <img src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"/>
</mdui-avatar>
```

The `fit` attribute determines how the image should fit the container box. It works similar to the native [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property.

### Icon Avatar {#example-icon}

To use a Material Icons icon as the avatar, specify the icon using the `icon` attribute. Alternatively, provide an icon element within the default slot.

```html,example,expandable
<mdui-avatar icon="people_alt"></mdui-avatar>

<mdui-avatar>
  <mdui-icon name="people_alt"></mdui-icon>
</mdui-avatar>
```

### Character Avatar {#example-char}

You can use any text within the default slot as the avatar.

```html,example,expandable
<mdui-avatar>A</mdui-avatar>
```
