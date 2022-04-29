export enum Easing {
  /**
   * 标准动画
   */
  STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)',

  /**
   * 加速动画
   */
  ACCELERATION = 'cubic-bezier(0.4, 0, 1, 1)',

  /**
   * 减速动画
   */
  DECELERATION = 'cubic-bezier(0, 0, 0.2, 1)',

  /**
   * 线性动画
   */
  LINEAR = 'cubic-bezier(0, 0, 1, 1)',
}
