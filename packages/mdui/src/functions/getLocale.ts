import {
  getLocale as getLocaleInternal,
  uninitializedError,
} from './utils/localize.js';
import type { GetLocal } from './utils/localize.js';

/**
 * todo 写好注释
 */
export const getLocale: GetLocal = () => {
  if (!getLocaleInternal) {
    throw new Error(uninitializedError);
  }

  return getLocaleInternal();
};
