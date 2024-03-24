import { initializeLocalize } from '../internal/localize.js';
import type { LoadFunc } from '../internal/localize.js';

/**
 * 加载语言包。参数为一个函数，该函数接收一个语言代码作为参数，返回一个 Promise，resolve 的值为对应的语言包
 * @param loadFunc
 */
export const loadLocale: (loadFunc: LoadFunc) => void = (loadFunc) => {
  initializeLocalize(loadFunc);
};
