import $ from '../$';
import { JQ } from '../JQ';
import { getStyle } from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 显示集合中的所有元素
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
    display = getStyle(element, 'display');
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
$.fn.show = function (this: JQ): JQ {
  return this.each(function () {
    if (this.style.display === 'none') {
      this.style.display = '';
    }

    if (getStyle(this, 'display') === 'none') {
      this.style.display = defaultDisplay(this.nodeName);
    }
  });
};
