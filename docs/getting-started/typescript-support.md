mdui 本身就是用 TypeScript 开发的，对 TypeScript 有非常好的支持。所有 mdui 官方库都自带类型声明文件，可以直接使用。

有时，你可能需要将一个 JavaScript 变量断言成一个 mdui 的组件实例，你可以直接从 mdui 中导入对应的组件类型。

例如，将 `button` 变量断言成 `Button` 类型。这时，你的 IDE 会自动提示 `button` 变量的属性和方法：

```ts
import type { Button } from 'mdui/components/button.js';

const button = document.querySelector('mdui-button') as Button;
```

如果你使用全量导入，则可以使用：

```ts
import type { Button } from 'mdui';

const button = document.querySelector('mdui-button') as Button;
```
