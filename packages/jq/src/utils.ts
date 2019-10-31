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
  return string.replace(/[A-Z]/g, replacer => '-' + replacer.toLowerCase());
}

function getComputedStyleValue(element: Element, name: string): string {
  return window
    .getComputedStyle(element, null)
    .getPropertyValue(toKebabCase(name));
}

function getChildNodesArray(target: string, parent: string): Array<Node> {
  const tempParent = document.createElement(parent);
  tempParent.innerHTML = target;

  return [].slice.call(tempParent.childNodes);
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
  toElement,
  toCamelCase,
  toKebabCase,
  getComputedStyleValue,
  getChildNodesArray,
  cssNumber,
};
