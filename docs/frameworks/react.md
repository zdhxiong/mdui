在 React 中使用 mdui 时，只需按照 [安装](/docs/2/getting-started/installation#npm) 页面的介绍完成安装，即可正常使用。

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

### JSX TypeScript 类型定义

可在项目中手动引入 JSX 扩展类型

```ts
/// <reference types="mdui/jsx.d.ts" />
```
