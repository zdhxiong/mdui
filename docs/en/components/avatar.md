# Avatar Component

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

```html,example,playgroundId=187
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
```

## Examples {#examples}

### Image Avatar {#example-src}

Use the `src` attribute to set an image as the avatar, or pass an `<img>` element into the default slot.

```html,example,expandable,playgroundId=188
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>

<mdui-avatar>
  <img src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4" alt="Example of profile picture"/>
</mdui-avatar>
```

The `fit` attribute controls how the image fits in its container. It works similarly to the native [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property.

### Icon Avatar {#example-icon}

Use the `icon` attribute to set a Material Icon for the avatar. Alternatively, pass an icon element into the default slot.

```html,example,expandable,playgroundId=189
<mdui-avatar icon="people_alt"></mdui-avatar>

<mdui-avatar>
  <mdui-icon name="people_alt"></mdui-icon>
</mdui-avatar>
```

### Character Avatar {#example-char}

You can use any text in the default slot as the avatar.

```html,example,expandable,playgroundId=190
<mdui-avatar>A</mdui-avatar>
```
