在 React 中使用 mdui 时，只需要按照 [安装](/zh-cn/docs/2/getting-started/installation#npm) 页面的步骤完成安装即可。

## 注意事项 {#notes}

在 React 中使用 mdui 时，存在一些限制。这些限制是在 React 中使用 Web Components 的通用限制，而非 mdui 组件库本身的限制。

### 事件绑定 {#event-binding}

由于 React 不支持自定义事件，因此在使用 mdui 组件提供的事件时，需要先使用 `ref` 属性获取组件的引用。

以下是在 React 中使用 mdui 组件事件的示例：

```js
class Home extends Component {
  constructor(props) {
    super(props);
    this.switchRef = React.createRef();
  }

  componentDidMount() {
    this.switchRef.current.addEventListener('change', event => {
      console.log('switch is toggled');
    });
  }

  render() {
    return(
      <mdui-switch ref={this.switchRef}></mdui-switch>
    );
  }
}
```

### JSX TypeScript 类型声明 {#jsx-typescript}

如果你在 TypeScript 文件（.tsx）中使用 mdui，需要添加 TypeScript 类型声明。你需要在项目的 .d.ts 文件中手动引入 mdui 的类型声明文件：

```ts
/// <reference types="mdui/jsx.zh-cn.d.ts" />
```
