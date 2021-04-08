import { toKebabCase } from './core.js';

/**
 * 获取元素的样式值
 * @param element
 * @param name
 */
export const getComputedStyleValue = (
  element: HTMLElement,
  name: string,
): string => {
  return window.getComputedStyle(element).getPropertyValue(toKebabCase(name));
};

/**
 * 检查元素的 box-sizing 是否是 border-box
 * @param element
 */
export const isBorderBox = (element: HTMLElement): boolean => {
  return getComputedStyleValue(element, 'box-sizing') === 'border-box';
};

/**
 * 获取元素的 padding, border, margin 宽度（两侧宽度的和，单位为px）
 * @param element
 * @param direction
 * @param extra
 */
export const getExtraWidth = (
  element: HTMLElement,
  direction: 'width' | 'height',
  extra: 'padding' | 'border' | 'margin',
): number => {
  const position =
    direction === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  return [0, 1].reduce((prev, _, index) => {
    let prop = extra + position[index];

    if (extra === 'border') {
      prop += 'Width';
    }

    return prev + parseFloat(getComputedStyleValue(element, prop) || '0');
  }, 0);
};

/**
 * 获取元素的样式值，对 width 和 height 进行过处理
 * @param element
 * @param name
 */
export const getStyle = (element: HTMLElement, name: string): string => {
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
};

/**
 * 数值单位的 CSS 属性
 */
export const cssNumber = [
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
