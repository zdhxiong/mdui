/**
 * 表单控件的值
 */
export type FormControlValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[];

/**
 * 表单控件接口，所有表单控件组件都要实现该接口
 */
export interface FormControl extends Element {
  name: string;
  value: FormControlValue;
  checked?: boolean;
  disabled: boolean;
  defaultValue?: FormControlValue;
  defaultChecked?: boolean;
  form?: string;

  checkValidity: () => boolean;
  reportValidity: () => boolean;
  setCustomValidity: (message: string) => void;
}

/**
 * 使用该 WeakMap 来存储指定表单中所有的 mdui 表单控件
 * 在每个表单控件的 hostConnected 中添加、hostDisconnected 中移除对应表单的 mdui 表单控件，
 * 然后在 getFormControls 方法中就能获取到表单中所有的 mdui 表单控件
 */
export const formCollections: WeakMap<
  HTMLFormElement,
  Set<FormControl>
> = new WeakMap();

/**
 * 获取表单中的所有表单控件，包含原生和 mdui 表单控件
 * 原生的 `HTMLFormElement.elements` 仅返回原生表单控件，不包含 mdui 表单控件
 */
export const getFormControls = (
  form: HTMLFormElement,
): Array<Element | FormControl> => {
  const rootNode = form.getRootNode() as Document | ShadowRoot;
  const allNodes = [...rootNode.querySelectorAll('*')];
  const nativeFormControls = [...form.elements];
  const collection = formCollections.get(form);
  const formControls = collection ? Array.from(collection) : [];

  // 按 DOM 元素的顺序排序
  return [...nativeFormControls, ...formControls].sort(
    (a: Element, b: Element) => {
      if (allNodes.indexOf(a) < allNodes.indexOf(b)) {
        return -1;
      }

      if (allNodes.indexOf(a) > allNodes.indexOf(b)) {
        return 1;
      }

      return 0;
    },
  );
};
