/**
 * 标准动画（从一个静止状态移动到另一个静止状态时使用）
 */
export const EASING_STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * 加速动画（元素进入时使用）
 */
export const EASING_ACCELERATION = 'cubic-bezier(0.4, 0, 1, 1)';

/**
 * 减速动画（元素退出时使用）
 */
export const EASING_DECELERATION = 'cubic-bezier(0, 0, 0.2, 1)';

/**
 * 线性动画（透明度的变化使用）
 */
export const EASING_LINEAR = 'cubic-bezier(0, 0, 1, 1)';

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
];

/**
 * 共享轴向右进入
 */
export const KEYFRAME_SHARED_X_AXIS_IN_RIGHT = [
  { opacity: 0, transform: 'translateX(-30px)' },
];

/**
 * 共享轴向上进入
 */
export const KEYFRAME_SHARED_Y_AXIS_IN_TOP = [
  { opacity: 0, transform: 'translateY(30px)' },
];

/**
 * 共享轴向下进入
 */
export const KEYFRAME_SHARED_Y_AXIS_IN_BOTTOM = [
  { opacity: 0, transform: 'translateY(-30px)' },
];

/**
 * 共享轴放大进入
 */
export const KEYFRAME_SHARED_Z_AXIS_IN_ZOOM_IN = [
  { opacity: 0, transform: 'scale(0.8)' },
];

/**
 * 共享轴缩小进入
 */
export const KEYFRAME_SHARED_Z_AXIS_IN_ZOOM_OUT = [
  { opacity: 0, transform: 'scale(1.1)' },
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
];

/**
 * Fade 退出
 */
export const KEYFRAME_FADE_OUT = [{ opacity: 1 }, { opacity: 0 }];
