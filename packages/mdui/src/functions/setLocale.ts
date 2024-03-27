import {
  setLocale as setLocaleInternal,
  uninitializedError,
} from './utils/localize.js';
import type { SetLocal } from './utils/localize.js';

/**
 * todo 写好注释
 * @param locale
 */
export const setLocale: SetLocal = (locale) => {
  if (!setLocaleInternal) {
    throw new Error(uninitializedError);
  }

  return setLocaleInternal(locale);
};
