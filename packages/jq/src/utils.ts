function isNodeName(element: HTMLElement, name: string): boolean {
  return element.nodeName.toLowerCase() === name.toLowerCase();
}

function isArrayLike(target: any): target is ArrayLike<any> {
  return typeof target.length === 'number';
}

function isObjectLike(target: any): target is Record<string, any> {
  return typeof target === 'object' && target !== null;
}

function isFunction(target: any): target is Function {
  return typeof target === 'function';
}

function isString(target: any): target is string {
  return typeof target === 'string';
}

function isUndefined(target: any): target is undefined {
  return typeof target === 'undefined';
}

function isNull(target: any): target is null {
  return target === null;
}

function isWindow(target: any): target is Window {
  return target instanceof Window;
}

function isDocument(target: any): target is HTMLDocument {
  return target instanceof HTMLDocument;
}

function isElement(target: any): target is HTMLElement {
  return target instanceof HTMLElement;
}

export {
  isNodeName,
  isArrayLike,
  isObjectLike,
  isFunction,
  isString,
  isUndefined,
  isNull,
  isWindow,
  isDocument,
  isElement,
};
