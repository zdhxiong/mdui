创建一个节流函数，在指定时间内最多执行一次函数。

## 使用方法 {#usage}

按需导入函数：

```js
import { throttle } from 'mdui/functions/throttle.js';
```

使用示例：

```js
// 这个函数在 100 毫秒内最多执行一次，可避免在滚动时过于频繁地调用该函数
window.addEventListener('scroll', throttle(() => {
  console.log('update');
}, 100));
```

## API {#api}

```ts
throttle(func: Function, wait: number): Function
```

参数为需要节流的函数，及最多多少毫秒执行一次；返回节流的函数。
