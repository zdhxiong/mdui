mdui 使用浏览器原生支持的 Web Components 开发，因此能在所有 Web 框架中使用。下面列举了在常用框架中使用 mdui 的方法。

## Aurelia {#Aurelia}

在按照 [安装](/zh-cn/docs/2/getting-started/installation#npm) 页面的指引完成安装后，还需要安装和配置一个额外的包（仅适用于 Aurelia 2）：

```bash
npm install aurelia-mdui --save
```

然后将其注册到应用中：

```typescript
import { MduiWebTask } from 'aurelia-mdui';

Aurelia
  .register(MduiWebTask)
  .app(MyApp)
  .start();
```

**注意**

请将错误报告发送到 [https://github.com/mreiche/aurelia-mdui](https://github.com/mreiche/aurelia-mdui)

## WebCell {#WebCell}

在 [WebCell](https://web-cell.dev/) 中使用 mdui 时，只需要按照 [安装](/zh-cn/docs/2/getting-started/installation#npm) 页面的步骤完成安装即可，Web Components、TypeScript 和 JSX 支持是一级特性且开箱即用的。

或者，您可用 [官方 GitHub 模板仓库](https://github.com/EasyWebApp/WebCell-mobile) 来 [一键创建新项目](https://github.com/new?template_name=WebCell-mobile&template_owner=EasyWebApp)。
