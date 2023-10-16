import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';

/**
 * 获取由 CSS 变量定义的缓动曲线值
 * @param element 在指定元素上获取值；若需要获取全局值，则传入 document.body
 * @param name 缓动曲线名称
 */
export const getEasing = (
  element: HTMLElement,
  name:
    | 'linear' // 线性动画（透明度的变化使用）
    | 'standard' // 标准动画（小型组件使用）（从一个静止状态移动到另一个静止状态时使用）
    | 'standard-accelerate' // 标准加速动画（元素退出时使用）
    | 'standard-decelerate' // 标准减速动画（元素进入时使用）
    | 'emphasized' // 强调动画（全屏动画、大型组件使用）
    | 'emphasized-accelerate' // 强调加速动画
    | 'emphasized-decelerate', // 强调减速动画
): string => {
  const cssVariableName = `--mdui-motion-easing-${name}`;

  return $(element).css(cssVariableName).trim();
};

/**
 * 获取由 CSS 变量定义的动画持续时间
 * @param element 在指定元素上获取值；若需要获取全局值，则传入 document.body
 * @param name 持续时间名称
 */
export const getDuration = (
  element: HTMLElement,
  name:
    | 'short1' // 50ms
    | 'short2' // 100ms
    | 'short3' // 150ms
    | 'short4' // 200ms
    | 'medium1' // 250ms
    | 'medium2' // 300ms
    | 'medium3' // 350ms
    | 'medium4' // 400ms
    | 'long1' // 450ms
    | 'long2' // 500ms
    | 'long3' // 550ms
    | 'long4' // 600ms
    | 'extra-long1' // 700ms
    | 'extra-long2' // 800ms
    | 'extra-long3' // 900ms
    | 'extra-long4', // 1000ms
): number => {
  const cssVariableName = `--mdui-motion-duration-${name}`;
  const cssValue = $(element).css(cssVariableName).trim().toLowerCase();

  if (cssValue.endsWith('ms')) {
    return parseFloat(cssValue);
  } else {
    return parseFloat(cssValue) * 1000;
  }
};
