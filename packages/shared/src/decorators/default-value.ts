/**
 * defaultValue 装饰器。在 attribute 属性变更时，若值和 property 值不一致，则会保存新的 attribute 值
 *
 * 用于在调用表单的 reset() 方法时，还原成初始值
 *
 * @property({ reflect: true }) value = '';
 * @defaultValue() defaultValue = '';
 *
 * @property({ type: Boolean, reflect: true }) checked = false;
 * @defaultValue('checked') defaultChecked = false;
 */

import { defaultConverter } from 'lit';
import { isFunction, isString } from '@mdui/jq/shared/helper.js';
import type { ReactiveElement } from 'lit';

/**
 * @param propertyName 对应的属性名
 */
export function defaultValue(propertyName = 'value') {
  return (proto: ReactiveElement, key: string) => {
    const constructor = proto.constructor as typeof ReactiveElement;
    const attributeChangedCallback =
      constructor.prototype.attributeChangedCallback;

    constructor.prototype.attributeChangedCallback = function (
      this: ReactiveElement & { [name: string]: unknown },
      name,
      old,
      value,
    ) {
      const options = constructor.getPropertyOptions(propertyName);
      const attributeName = isString(options.attribute)
        ? options.attribute
        : propertyName;

      if (name === attributeName) {
        const converter = options.converter || defaultConverter;
        const fromAttribute = isFunction(converter)
          ? converter
          : (converter?.fromAttribute ?? defaultConverter.fromAttribute);

        const newValue: unknown = fromAttribute!(value, options.type);

        if (this[propertyName] !== newValue) {
          this[key] = newValue;
        }
      }

      attributeChangedCallback.call(this, name, old, value);
    };
  };
}
