mdui 的组件都是标准的 Web Components 组件，你可以像使用 `<div>` 标签一样使用 mdui 组件。每个组件的文档中都详细描述了其完整的 API，包括属性、方法、事件、slot、CSS Part、CSS 自定义属性等。

本章文档将向你介绍 Web Components 的使用方法。

## 属性 {#attribute}

属性分为 HTML 属性和 JavaScript 属性，它们通常是一一对应的，并且会保持同步。也就是说，当你更新 HTML 属性值时，JavaScript 属性值也会随之更新；反之亦然。

HTML 属性可以直接在组件的 HTML 字符串中设置，并通过 `getAttribute` 和 `setAttribute` 方法进行读取和修改：

```html
<mdui-button variant="text">点我</mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  // 修改 HTML 属性
  button.setAttribute('variant', 'outlined');

  // 读取 HTML 属性
  console.log(button.getAttribute('variant')); // outlined
</script>
```

JavaScript 属性则可以直接读取或设置组件实例的属性值：

```html
<mdui-button variant="text">点我</mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  // 设置 JavaScript 属性
  button.variant = 'outlined';

  // 读取 JavaScript 属性
  console.log(button.variant); // outlined
</script>
```

某些属性值是 boolean 类型，这些属性的 HTML 属性存在时，JavaScript 属性为 `true`，否则为 `false`。但是，为了兼容某些框架，mdui 会把字符串 `false` 值也判定为 boolean 值 `false`。

```html
<!-- 这个组件存在 disabled 属性，即默认 disabled 属性值为 true -->
<mdui-button disabled></mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  button.removeAttribute('disabled'); // 等效于 button.disabled = false;
  button.setAttribute('disabled', ''); // 等效于 button.disabled = true;

  // 例外情况，设置为字符串 false 值，等效于设置成 boolean 值 false
  button.setAttribute('disabled', 'false'); // 等效于 button.disabled = false;
</script>
```

有时属性值是数组、对象或函数，这时只有 JavaScript 属性，没有对应的 HTML 属性，例如 [`<mdui-slider>`](/zh-cn/docs/2/components/slider) 组件的 [`labelFormatter`](/zh-cn/docs/2/components/slider#attributes-labelFormatter) 属性是一个函数，你只能通过 JavaScript 来设置该属性：

```html
<mdui-slider></mdui-slider>

<script>
  const slider = document.querySelector('mdui-slider');
  slider.labelFormatter = (value) => `${value}%`;
</script>
```

下面以 [`<mdui-slider>`](/zh-cn/docs/2/components/slider) 组件属性文档的一部分进行举例说明：

| HTML 属性 | JavaScript 属性  | reflect                                                                                |
| --------- | ---------------- | -------------------------------------------------------------------------------------- |
| `name`    | `name`           | <mdui-icon name="check--rounded" style="user-select:none;font-size:1rem;"></mdui-icon> |
| `value`   | `value`          |                                                                                        |
|           | `labelFormatter` |                                                                                        |

这个组件的 `name` 属性具有 HTML 属性和 JavaScript 属性，且 reflect 一栏表明更新 JavaScript 属性时会同步更新 HTML 属性。而 `value` 属性在更新 JavaScript 属性时不会更新 HTML 属性。`labelFormatter` 属性则只有 JavaScript 属性。

## 方法 {#method}

部分组件提供了公共方法，你可以通过调用这些方法来实现不同的功能。例如，[`<mdui-text-field>`](/zh-cn/docs/2/components/text-field) 组件的 [`focus()`](/zh-cn/docs/2/components/text-field#methods-focus) 方法可以使文本框获得焦点。

```html
<mdui-text-field></mdui-text-field>

<script>
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
</script>
```

可以在各个组件的文档页面查看所有可用的方法及其参数。

## 事件 {#event}

部分组件在执行特定操作时会触发事件。例如，[`<mdui-dialog>`](/zh-cn/docs/2/components/dialog) 组件在打开时会触发 [`open`](/zh-cn/docs/2/components/dialog#events-open) 事件，你可以监听这个事件来执行自定义操作。

```html
<mdui-dialog>Dialog</mdui-dialog>

<script>
  const dialog = document.querySelector('mdui-dialog');

  dialog.addEventListener('open', () => {
    console.log('对话框开始打开时，会触发该事件');
  });
</script>
```

可以在各个组件的文档页面查看所有可用的事件及其参数。

如果你在其他框架（如 Vue、React、Angular 等）中使用 mdui，你可以使用框架提供的语法来绑定事件。但是，一些框架（如 React）的事件绑定语法只能用于绑定标准事件（如 `click` 事件），而无法用于绑定自定义事件（如 `open` 事件）。因此，在 React 中绑定自定义事件时，你需要先获取元素的引用，然后使用 `addEventListener` 方法来绑定事件。

关于在 React 中使用 mdui 的更多信息，参见 [与框架集成 - React](/zh-cn/docs/2/frameworks/react)。

## Slot {#slot}

许多组件都提供了 slot，用于将自定义的 HTML 内容插入到组件内部。

最常见的是默认 slot，它是位于组件内部的一段普通 HTML 或纯文本。例如 [`<mdui-button>`](/zh-cn/docs/2/components/button) 组件的默认 slot 用于设置按钮的文本。示例中的“点我”就是默认 slot 的内容：

```html
<mdui-button>点我</mdui-button>
```

部分组件还提供了具名 slot，具名 slot 需要在 HTML 的 `slot` 属性中指定 slot 名称。下面的示例中，[`<mdui-icon>`](/zh-cn/docs/2/components/icon) 组件指定了 `slot="start"`，表示这是名为 [`start`](/zh-cn/docs/2/components/button#slots-icon) 的具名 slot，即这个图标将被插入到组件内部的左侧：

```html
<mdui-button>
  <mdui-icon slot="start" name="settings"></mdui-icon>
  设置
</mdui-button>
```

如果一个组件使用了多个具名 slot，那么各个具名 slot 之间的顺序并不重要，只要它们位于组件内部，浏览器就会自动将它们放置到正确的位置。

可以在各个组件的文档页面查看所有支持的 Slot。

## CSS 自定义属性 {#css-custom-properties}

CSS 自定义属性是 CSS 中的变量。mdui 定义了一系列[全局 CSS 自定义属性](/zh-cn/docs/2/styles/design-tokens)，这些属性在各个组件内部被引用，因此你可以通过修改这些 CSS 自定义属性来全局修改 mdui 组件的样式。

例如，下面的代码会缩小所有组件的圆角大小：

```css
:root {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}
```

也可以在局部作用域上修改 CSS 自定义属性。例如，下面的代码只会在含 `class="sharp"` 的元素及其子元素中缩小圆角大小：

```css
.sharp {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}
```

一些组件还提供了该组件特有的 CSS 自定义属性，这些属性的作用域为特定组件，所以不包含 `--mdui` 前缀。例如，下面的代码通过修改 [`<mdui-dialog>`](/zh-cn/docs/2/components/dialog) 组件的 `--z-index` 属性，实现了修改 `z-index` 样式：

```css
mdui-dialog {
  --z-index: 3000;
}
```

可以在各个组件的文档页面查看组件支持的 CSS 自定义属性。

## CSS Part {#css-part}

mdui 组件使用 shadow DOM 来封装样式和行为，但是常规 CSS 选择器无法选择到 shadow DOM 内部的元素。因此，一些组件为 Shadow DOM 元素添加了 `part` 属性，你可以使用 `::part` CSS 选择器来选择到对应的元素，并重写部分样式。

例如，下面的代码使用 [`button`](/zh-cn/docs/2/components/button#cssParts-button) part 修改了按钮的内边距，且使用 [`label`](/zh-cn/docs/2/components/button#cssParts-label)、[`icon`](/zh-cn/docs/2/components/button#cssParts-icon)、[`end-icon`](/zh-cn/docs/2/components/button#cssParts-end-icon) part 分别修改了文本、左右图标的颜色：

```html,example
<mdui-button class="custom-button" icon="explore" end-icon="flight">Button</mdui-button>

<style>
  .custom-button::part(button) {
    padding: 0 2rem;
  }

  .custom-button::part(label) {
    color: blue;
  }

  .custom-button::part(icon) {
    color: red;
  }

  .custom-button::part(end-icon) {
    color: yellow;
  }
</style>
```

关于组件 shadow DOM 元素的结构和默认样式，你可以打开浏览器的开发人员工具进行查看。

在使用 CSS Part 之前，你应该先判断使用全局 CSS 自定义属性、及组件特有的 CSS 自定义属性能否满足你的需求，如果能满足需求，则应优先使用 CSS 自定义属性来定制样式。

可以在各个组件的文档页面查看组件公开的所有 `part` 属性。

## 组件更新机制 {#update-mechanism}

mdui 组件是基于 [Lit](https://lit.dev/) 开发的。Lit 是一个轻量级的库，它使 Web Components 的开发更加简单。在使用 mdui 组件时，你可能需要了解其渲染和更新机制。

当你修改 mdui 组件的属性时，组件会进行重新渲染。但是，这个重新渲染过程并不是同步进行的。当你同时修改了多个属性值时，Lit 会将这些变更缓存起来，直到下一个更新周期，以确保无论你修改了多少次属性值，每个组件只会重新渲染一次。并且，只有 shadow DOM 中发生变更的部分会被重新渲染。

在下面的示例中，我们将按钮的 `disabled` JavaScript 属性值设置为 `true`，然后立即查询其 HTML 属性。但是，由于此时组件还没有进行重新渲染，因此查询到的 HTML 属性仍然是 `false`：

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

console.log(button.hasAttribute('disabled')); // false
```

如果要等待一个属性值变更后的重新渲染完成，可以使用组件的 `updateComplete` 属性。该属性返回一个 Promise，在 Promise 被 resolve 后，即表示组件已经完成了重新渲染：

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() => {
  console.log(button.hasAttribute('disabled')); // true
});
```
