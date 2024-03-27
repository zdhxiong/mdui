import { initializeLocalize } from './utils/localize.js';
import type { LoadFunc } from './utils/localize.js';

/**
 * todo 写好注释
 * 定义一个函数，用于加载语言配置
 * 返回 Promise
 */
export const loadLocale: (loadFunc: LoadFunc) => void = (loadFunc) => {
  initializeLocalize(loadFunc);
};
