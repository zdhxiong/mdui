import {
  setLocale as setLocaleInternal,
  uninitializedError,
} from '../internal/localize.js';
import type { SetLocal } from '../internal/localize.js';

/**
 * 切换到指定的语言。返回 Promise，在新的语言包加载完成后 resolve
 * @param locale 语言代码
 */
export const setLocale: SetLocal = (locale) => {
  if (!setLocaleInternal) {
    throw new Error(uninitializedError);
  }

  return setLocaleInternal(locale);
};
