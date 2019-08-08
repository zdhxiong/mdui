import $ from '../$';
import './each';

const elementDisplay = {};

/**
 * 获取元素的默认 display 样式值，用于 .show() 方法
 * @param nodeName
 * @returns {*}
 */
function defaultDisplay(nodeName) {
  let element;
  let display;

  if (!elementDisplay[nodeName]) {
    element = document.createElement(nodeName);
    document.body.appendChild(element);
    display = getComputedStyle(element, '').getPropertyValue('display');
    element.parentNode.removeChild(element);
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
$.fn.show = function () {
  return this.each(function () {
    if (this.style.display === 'none') {
      this.style.display = '';
    }

    if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
      this.style.display = defaultDisplay(this.nodeName);
    }
  });
};
