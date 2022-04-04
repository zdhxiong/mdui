/**
 * 延迟多少毫秒执行
 */
export const delay = (duration = 0) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};
