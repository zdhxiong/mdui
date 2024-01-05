在 React 中使用 mdui 时，只需按照 [安装](/zh-cn/docs/2/getting-started/installation#npm) 页面的介绍完成安装，即可正常使用。

## 注意事项 {#notes}

在 React 中使用 mdui 时，有一些限制。这些限制是在 React 中使用 Web Components 的通用限制，并非 mdui 独有的限制。

### 事件绑定 {#event-binding}

因为 React 不支持自定义事件，因此在使用 mdui 组件提供的事件时，需要先使用 `ref` 属性获取组件的引用。

下面是在 React 中使用 mdui 组件事件的示例：

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

### JSX TypeScript 类型声明

如果你在 TypeScript 文件（.tsx） 中使用 mdui，需要添加 TypeScript 类型声明。你需要手动在项目的 .d.ts 文件中引入 mdui 的类型声明文件：

```ts
/// <reference types="mdui/jsx.zh-cn.d.ts" />
```
