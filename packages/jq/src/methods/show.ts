import $ from '../$';
import { JQ } from '../JQ';
import { getComputedStyleValue } from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 显示对象中的所有元素
     * 即将元素的 display 属性恢复到初始值
     * @example
```js
$('.box').show()
```
     */
    show(): this;
  }
}

const elementDisplay: {
  [nodeName: string]: string;
} = {};

/**
 * 获取元素的初始 display 值，用于 .show() 方法
 * @param nodeName
 */
function defaultDisplay(nodeName: string): string {
  let element: HTMLElement;
  let display: string;

  if (!elementDisplay[nodeName]) {
    element = document.createElement(nodeName);
    document.body.appendChild(element);
    display = getComputedStyleValue(element, 'display');
    element.parentNode!.removeChild(element);
    if (display === 'none') {
      display = 'block';
    }

    elementDisplay[nodeName] = display;
  }

  return elementDisplay[nodeName];
}

/**
 * 显示指定元素
 * @returns {JQ}
 */
$.fn.show = function(this: JQ): JQ {
  return this.each(function() {
    if (this.style.display === 'none') {
      this.style.display = '';
    }

    if (getComputedStyleValue(this, 'display') === 'none') {
      this.style.display = defaultDisplay(this.nodeName);
    }
  });
};
