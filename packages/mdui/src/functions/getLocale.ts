import {
  getLocale as getLocaleInternal,
  uninitializedError,
} from '../internal/localize.js';
import type { GetLocal } from '../internal/localize.js';

/**
 * 获取当前的语言代码。如果当前正在加载新的语言包，则该函数仍返回先前的语言代码
 * @return string 当前的语言代码
 */
export const getLocale: GetLocal = () => {
  if (!getLocaleInternal) {
    throw new Error(uninitializedError);
  }

  return getLocaleInternal();
};
