import { nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * 如果 value 不是空字符串、null、undefined 时，设置 attribute；否则移除 attribute
 * @param value
 */
export const ifNonEmpty = <T>(value: T): T | typeof nothing => {
  return ifDefined((value as unknown) === '' ? undefined : value);
};
