import { LitElement } from 'lit-element';
import { Constructor } from 'lit-element/lib/decorators';
import $ from 'mdui.jq/es/$';

// Copy from lit-element/src/lib/decorators
export interface ClassElement {
  kind: 'field'|'method';
  key: PropertyKey;
  placement: 'static'|'prototype'|'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

export const queryDecorator = (
  selector: string,
  isReturnNative?: boolean,
  isQueryAll?: boolean,
  isAsync?: boolean
) => (
  protoOrDescriptor: Object|ClassElement,
  // tslint:disable-next-line:no-any decorator
  name?: PropertyKey
): any => {
  const queryResult = (component: LitElement) => {
    const element = isQueryAll
      ? component.renderRoot.querySelectorAll(selector)
      : component.renderRoot.querySelector(selector);

    return isReturnNative ? element : $(element);
  }

  const getter = isAsync
    ? async function get(this: LitElement) {
      await this.updateComplete;
      return queryResult(this);
    }
    : function get(this: LitElement) {
      return queryResult(this);
    };

  const descriptor: PropertyDescriptor = {
    enumerable: true,
    configurable: true,
    get: getter,
  }

  if (name !== undefined) {
    Object.defineProperty(protoOrDescriptor as Object, name, descriptor);
    return null;
  }

  return {
    kind: 'method',
    placement: 'prototype',
    key: (protoOrDescriptor as ClassElement).key,
    descriptor,
  }
}
