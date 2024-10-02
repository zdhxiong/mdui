头像用于代表用户或事物，支持图片、图标或字符等。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/avatar.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Avatar } from 'mdui/components/avatar.js';
```

使用示例：

```html,example
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
```

## 示例 {#examples}

### 图片头像 {#example-src}

可以使用 `src` 属性指定一个图片链接作为头像，或者在 default slot 中提供一个 `<img>` 元素作为头像。

```html,example,expandable
<mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>

<mdui-avatar>
  <img src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4" alt="图片头像示例"/>
</mdui-avatar>
```

可以使用 `fit` 属性定义图片如何适应容器框，类似于原生的 [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

### 图标头像 {#example-icon}

可以使用 `icon` 属性指定一个 Material Icons 图标作为头像，或者在 default slot 中提供一个图标元素作为头像。

```html,example,expandable
<mdui-avatar icon="people_alt"></mdui-avatar>

<mdui-avatar>
  <mdui-icon name="people_alt"></mdui-icon>
</mdui-avatar>
```

### 字符头像 {#example-char}

可以在 default slot 中使用任意文字作为头像。

```html,example,expandable
<mdui-avatar>A</mdui-avatar>
```
