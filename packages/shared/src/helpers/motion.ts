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

  return parseFloat($(element).css(cssVariableName).trim());
};

// 动画的关键帧在每个组件中单独定义

/**
 * 小型动画（如 switch）
 */
export const DURATION_SMALL = 100;

/**
 * 中型动画（进入）（如 drawer 打开）
 */
export const DURATION_MEDIUM_IN = 250;

/**
 * 中型动画（退出）（如 drawer 关闭）
 */
export const DURATION_MEDIUM_OUT = 200;

/**
 * 大型动画（进入）（如 FAB 切换成全屏 dialog）
 */
export const DURATION_LARGE_IN = 300;

/**
 * 大型动画（退出）（如全屏 dialog 退回到 FAB）
 */
export const DURATION_LARGE_OUT = 250;

/**
 * 共享轴进入
 */
export const DURATION_SHARED_AXIS_IN = 210;

/**
 * 共享轴退出
 */
export const DURATION_SHARED_AXIS_OUT = 90;

/**
 * Fade througth 进入
 */
export const DURATION_FADE_THROUGTH_IN = 210;

/**
 * Fade througth 退出
 */
export const DURATION_FADE_THROUGTH_OUT = 90;

/**
 * Fade 进入
 */
export const DURATION_FADE_IN = 150;

/**
 * Fade 退出
 */
export const DURATION_FADE_OUT = 75;

// TODO: Container https://material.io/design/motion/the-motion-system.html#container-transform

/**
 * 共享轴向左进入
 */
export const KEYFRAME_SHARED_X_AXIS_IN_LEFT = [
  { opacity: 0, transform: 'translateX(30px)' },
  { opacity: 1, transform: 'translateX(0)' },
];

/**
 * 共享轴向右进入
 */
export const KEYFRAME_SHARED_X_AXIS_IN_RIGHT = [
  { opacity: 0, transform: 'translateX(-30px)' },
  { opacity: 1, transform: 'translateX(0)' },
];

/**
 * 共享轴向上进入
 */
export const KEYFRAME_SHARED_Y_AXIS_IN_TOP = [
  { opacity: 0, transform: 'translateY(30px)' },
  { opacity: 1, transform: 'translateY(0)' },
];

/**
 * 共享轴向下进入
 */
export const KEYFRAME_SHARED_Y_AXIS_IN_BOTTOM = [
  { opacity: 0, transform: 'translateY(-30px)' },
  { opacity: 1, transform: 'translateY(0)' },
];

/**
 * 共享轴放大进入
 */
export const KEYFRAME_SHARED_Z_AXIS_IN_ZOOM_IN = [
  { opacity: 0, transform: 'scale(0.8)' },
  { opacity: 1, transform: 'scale(1)' },
];

/**
 * 共享轴缩小进入
 */
export const KEYFRAME_SHARED_Z_AXIS_IN_ZOOM_OUT = [
  { opacity: 0, transform: 'scale(1.1)' },
  { opacity: 1, transform: 'scale(1)' },
];

/**
 * 共享轴向左退出
 */
export const KEYFRAME_SHARED_X_AXIS_OUT_LEFT = [
  { opacity: 1 },
  { opacity: 0, transform: 'translateX(-30px)' },
];

/**
 * 共享轴向右退出
 */
export const KEYFRAME_SHARED_X_AXIS_OUT_RIGHT = [
  { opacity: 1 },
  { opacity: 0, transform: 'translateX(30px)' },
];

/**
 * 共享轴向上退出
 */
export const KEYFRAME_SHARED_Y_AXIS_OUT_TOP = [
  { opacity: 1 },
  { opacity: 0, transform: 'translateY(30px)' },
];

/**
 * 共享轴向下退出
 */
export const KEYFRAME_SHARED_Y_AXIS_OUT_BOTTOM = [
  { opacity: 1 },
  { opacity: 0, transform: 'translateY(-30px)' },
];

/**
 * 共享轴放大退出
 */
export const KEYFRAME_SHARED_Z_AXIS_OUT_ZOOM_IN = [
  { opacity: 1 },
  { opacity: 0, transform: 'scale(1.1)' },
];

/**
 * 共享轴缩小退出
 */
export const KEYFRAME_SHARED_Z_AXIS_OUT_ZOOM_OUT = [
  { opacity: 1 },
  { opacity: 0, transform: 'scale(0.8)' },
];

// TODO: Shared axis: fade variant

/**
 * Fade througth 进入
 */
export const KEYFRAME_FADE_THROUGTH_IN = [
  { transform: 'scale(0.92)', opacity: 0 },
  { transform: 'scale(1)', opacity: 1 },
];

/**
 * Fade througth 退出
 */
export const KEYFRAME_FADE_THROUGTH_OUT = [{ opacity: 1 }, { opacity: 0 }];

/**
 * Fade 进入
 */
export const KEYFRAME_FADE_IN = [
  { transform: 'scale(0.8)', opacity: 0 },
  { opacity: 1, offset: 0.3 },
  { transform: 'scale(1)' },
];

/**
 * Fade 退出
 */
export const KEYFRAME_FADE_OUT = [{ opacity: 1 }, { opacity: 0 }];
