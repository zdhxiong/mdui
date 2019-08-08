function isNodeName(element, name) {
  return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
}

function isArrayLike(target) {
  return typeof target.length === 'number';
}

function isObjectLike(target) {
  return typeof target === 'object' && target !== null;
}

function isFunction(target) {
  return typeof target === 'function';
}

function isString(target) {
  return typeof target === 'string';
}

function isWindow(target) {
  return target && target === target.window;
}

function isDocument(target) {
  return target && target.nodeType === target.DOCUMENT_NODE;
}

export {
  isNodeName,
  isObjectLike,
  isFunction,
  isString,
  isWindow,
  isDocument,
  isArrayLike,
};
