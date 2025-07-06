import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/text.js';

export type AccessibleProperties = {
  accessibleLabelledby?: string;
  accessibleLabel?: string;
  accessibleDescribedby?: string;
  accessibleDescription?: string;
};
type AccessibleComponent = HTMLElement & AccessibleProperties;
type MutationCallback = () => void;
type AssociatedElement = {
  observer: MutationObserver | null;
  callbacks: MutationCallback[];
};
type RegisteredComponent = {
  host: AccessibleComponent;
  observedElements: HTMLElement[];
  callback: MutationCallback;
};

const associatedElements = new WeakMap<HTMLElement, AssociatedElement>();
const registeredComponents = new WeakMap<
  AccessibleComponent,
  RegisteredComponent
>();

const observerOptions = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
};

/**
 * 获取指定元素中，accessibleLabelledby、accessibleDescribedby 属性引用的所有元素的文本内容。
 * @param component
 * @param propertyName
 */
const getRefTexts = (
  component: AccessibleComponent,
  propertyName: 'accessibleLabelledby' | 'accessibleDescribedby',
): string => {
  const ids = component[propertyName]?.split(' ') ?? [];

  return ids
    .filter(Boolean)
    .map((elementId) => $(`#${elementId}`).text().trim())
    .filter(Boolean)
    .join(' ');
};

/**
 * 获取 accessibleLabelledby 属性引用的所有元素的文本内容。
 * @param component
 */
export const getAccessibleLabelRefTexts = (
  component: AccessibleComponent,
): string => {
  return getRefTexts(component, 'accessibleLabelledby');
};

/**
 * 获取 accessibleDescribedby 属性引用的所有元素的文本内容。
 * @param component
 */
export const getAccessibleDescriptionRefTexts = (
  component: AccessibleComponent,
): string => {
  return getRefTexts(component, 'accessibleDescribedby');
};

/**
 * 获取 accessibleLabelledby、accessibleDescribedby 属性引用的所有元素。
 * @param component
 */
const getAssociatedElements = (
  component: AccessibleComponent,
): HTMLElement[] => {
  const ids = [component.accessibleLabelledby, component.accessibleDescribedby]
    .filter((v): v is string => Boolean(v))
    .flatMap((value) => value.split(' '))
    .filter(Boolean);

  if (!ids.length) {
    return [];
  }

  const selector = ids.map((id) => `#${id}`).join(', ');
  return $(selector).get();
};

/**
 * 添加关联元素的 MutationObserver
 * @param registeredComponent
 * @param element
 */
const addObserved = (
  registeredComponent: RegisteredComponent,
  element: HTMLElement,
): void => {
  let associatedElement = associatedElements.get(element);

  if (!associatedElement) {
    associatedElement = { observer: null, callbacks: [] };
    const observer = new MutationObserver(() => {
      associatedElement!.callbacks.forEach((callback) => {
        callback();
      });
    });

    associatedElement.observer = observer;
    observer.observe(element, observerOptions);
    associatedElements.set(element, associatedElement);
  }

  if (!associatedElement.callbacks.includes(registeredComponent.callback)) {
    associatedElement.callbacks.push(registeredComponent.callback);
  }
};

/**
 * 移除关联元素的 MutationObserver
 * @param registeredComponent
 * @param element
 */
const removeObserved = (
  registeredComponent: RegisteredComponent,
  element: HTMLElement,
): void => {
  const associatedElement = associatedElements.get(element);

  if (associatedElement) {
    associatedElement.callbacks = associatedElement.callbacks.filter(
      (itm) => itm !== registeredComponent.callback,
    );

    if (!associatedElement.callbacks.length) {
      associatedElement.observer?.disconnect();
      associatedElements.delete(element);
    }
  }

  registeredComponent.observedElements =
    registeredComponent.observedElements.filter((itm) => itm !== element);
};

/**
 * accessibleLabelledby 或 accessibleDescribedby 属性变更时执行
 * @param component
 */
export const onAccessiblePropertyChange = (
  component: AccessibleComponent,
): void => {
  const registeredElement = registeredComponents.get(component);
  if (!registeredElement) {
    return;
  }

  const oldAssociatedElements = registeredElement.observedElements;
  const newAssociatedElements = getAssociatedElements(component);
  oldAssociatedElements.forEach((oldElement) => {
    if (!newAssociatedElements.includes(oldElement)) {
      removeObserved(registeredElement, oldElement);
    }
  });
  newAssociatedElements.forEach((newElement) => {
    if (!oldAssociatedElements.includes(newElement)) {
      addObserved(registeredElement, newElement);
      registeredElement.observedElements.push(newElement);
    }
  });

  registeredElement?.callback();
};

/**
 * 注册组件的无障碍功能
 * @param component
 * @param callback
 */
export const registerAccessibility = (
  component: AccessibleComponent,
  callback: MutationCallback,
): void => {
  if (registeredComponents.has(component)) {
    return;
  }

  const associatedElements = getAssociatedElements(component);
  const registeredComponent = {
    host: component,
    observedElements: associatedElements,
    callback,
  };
  registeredComponents.set(component, registeredComponent);

  associatedElements.forEach((element) => {
    addObserved(registeredComponent, element);
  });

  callback();
};

/**
 * 取消注册组件的无障碍功能
 * @param component
 */
export const deregisterAccessibility = (
  component: AccessibleComponent,
): void => {
  const registeredComponent = registeredComponents.get(component);
  if (!registeredComponent) {
    return;
  }

  registeredComponent.observedElements.forEach((element) => {
    removeObserved(registeredComponent, element);
  });

  registeredComponents.delete(component);
};
