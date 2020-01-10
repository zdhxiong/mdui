import { toElement } from '../utils';

/**
 * 检查 container 元素内是否包含 contains 元素
 * @param container 父元素
 * @param contains 子元素
 * @example
```js
contains( document, document.body ); // true
contains( document.getElementById('test'), document ); // false
contains( $('.container').get(0), $('.contains').get(0) ); // false
```
 */
function contains(
  container: Element | Document,
  contains: Element | Document,
): boolean {
  return container !== contains && toElement(container).contains(contains);
}

export default contains;
