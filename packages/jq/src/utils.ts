function isNodeName(element: Element, name: string): boolean {
  return element.nodeName.toLowerCase() === name.toLowerCase();
}

function isFunction(target: any): target is Function {
  return typeof target === 'function';
}

function isString(target: any): target is string {
  return typeof target === 'string';
}

function isNumber(target: any): target is number {
  return typeof target === 'number';
}

function isBoolean(target: any): target is boolean {
  return typeof target === 'boolean';
}

function isUndefined(target: any): target is undefined {
  return typeof target === 'undefined';
}

function isNull(target: any): target is null {
  return target === null;
}

function isWindow(target: any): target is Window {
  return target instanceof Window;
}

function isDocument(target: any): target is Document {
  return target instanceof Document;
}

function isElement(target: any): target is Element {
  return target instanceof Element;
}

function isNode(target: any): target is Node {
  return target instanceof Node;
}

/**
 * 是否是 IE 浏览器
 */
function isIE(): boolean {
  // @ts-ignore
  return !!window.document.documentMode;
}

function isArrayLike(target: any): target is ArrayLike<any> {
  if (isFunction(target) || isWindow(target)) {
    return false;
  }

  return isNumber(target.length);
}

function isObjectLike(target: any): target is Record<string, any> {
  return typeof target === 'object' && target !== null;
}

function toElement(target: Element | Document): Element {
  return isDocument(target) ? target.documentElement : target;
}

/**
 * 把用 - 分隔的字符串转为驼峰（如 box-sizing 转换为 boxSizing）
 * @param string
 */
function toCamelCase(string: string): string {
  return string
    .replace(/^-ms-/, 'ms-')
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * 把驼峰法转为用 - 分隔的字符串（如 boxSizing 转换为 box-sizing）
 * @param string
 */
function toKebabCase(string: string): string {
  return string.replace(/[A-Z]/g, (replacer) => '-' + replacer.toLowerCase());
}

/**
 * 获取元素的样式值
 * @param element
 * @param name
 */
function getComputedStyleValue(element: HTMLElement, name: string): string {
  return window.getComputedStyle(element).getPropertyValue(toKebabCase(name));
}

/**
 * 检查元素的 box-sizing 是否是 border-box
 * @param element
 */
function isBorderBox(element: HTMLElement): boolean {
  return getComputedStyleValue(element, 'box-sizing') === 'border-box';
}

/**
 * 获取元素的 padding, border, margin 宽度（两侧宽度的和，单位为px）
 * @param element
 * @param direction
 * @param extra
 */
function getExtraWidth(
  element: HTMLElement,
  direction: 'width' | 'height',
  extra: 'padding' | 'border' | 'margin',
): number {
  const position =
    direction === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  return [0, 1].reduce((prev, _, index) => {
    let prop = extra + position[index];

    if (extra === 'border') {
      prop += 'Width';
    }

    return prev + parseFloat(getComputedStyleValue(element, prop) || '0');
  }, 0);
}

/**
 * 获取元素的样式值，对 width 和 height 进行过处理
 * @param element
 * @param name
 */
function getStyle(element: HTMLElement, name: string): string {
  // width、height 属性使用 getComputedStyle 得到的值不准确，需要使用 getBoundingClientRect 获取
  if (name === 'width' || name === 'height') {
    const valueNumber = element.getBoundingClientRect()[name];

    if (isBorderBox(element)) {
      return `${valueNumber}px`;
    }

    return `${
      valueNumber -
      getExtraWidth(element, name, 'border') -
      getExtraWidth(element, name, 'padding')
    }px`;
  }

  return getComputedStyleValue(element, name);
}

/**
 * 获取子节点组成的数组
 * @param target
 * @param parent
 */
function getChildNodesArray(target: string, parent: string): Array<Node> {
  const tempParent = document.createElement(parent);
  tempParent.innerHTML = target;

  return [].slice.call(tempParent.childNodes);
}

/**
 * 始终返回 false 的函数
 */
function returnFalse(): boolean {
  return false;
}

/**
 * 数值单位的 CSS 属性
 */
const cssNumber = [
  'animationIterationCount',
  'columnCount',
  'fillOpacity',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'gridArea',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnStart',
  'gridRow',
  'gridRowEnd',
  'gridRowStart',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'widows',
  'zIndex',
  'zoom',
];

export {
  isNodeName,
  isArrayLike,
  isObjectLike,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isUndefined,
  isNull,
  isWindow,
  isDocument,
  isElement,
  isNode,
  isIE,
  toElement,
  toCamelCase,
  toKebabCase,
  getComputedStyleValue,
  isBorderBox,
  getExtraWidth,
  getStyle,
  getChildNodesArray,
  returnFalse,
  cssNumber,
};
