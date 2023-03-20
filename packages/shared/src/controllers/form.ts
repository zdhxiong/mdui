/**
 * 参考：https://github.com/shoelace-style/shoelace/blob/next/src/internal/form.ts
 */
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/css.js';
import { formCollections } from '@mdui/jq/shared/form.js';
import { isFunction, isString, isUndefined } from '@mdui/jq/shared/helper.js';
import type { FormControl, FormControlValue } from '@mdui/jq/shared/form.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * 在执行 `<form>` 元素的 reportValidity() 时，不会执行 mdui 组件的 reportValidity() 方法，
 * 因此在 mdui 表单控件的 hostConnected 中把 `<form>` 的 reportValidity 替换为自定义方法，
 * hostDisconnected 中恢复为 原生 reportValidity 方法
 *
 * 该 WeakMap 用于存储指定 `<form>` 的原生 reportValidity 方法
 *
 * 日后使用 ElementInternals 可不再进行该处理，但当前 safari 浏览器不支持。
 */
const reportValidityOverloads: WeakMap<HTMLFormElement, () => boolean> =
  new WeakMap();

/**
 * 在执行表单的 reset() 方法后，使用该 WeakMap 存储指定表单中所有的表单控件
 * 在表单控件中监听值变更后，需要从该 WeakMap 中判断是否存在该表单控件，
 * 若存在，则 invalid 设置为 false（不显示验证不通过样式），同时从 WeakMap 中移除该表单控件
 */
export const formResets: WeakMap<
  HTMLFormElement,
  Set<FormControl>
> = new WeakMap();

export interface FormControllerOptions {
  form: (control: FormControl) => HTMLFormElement | null;
  name: (control: FormControl) => string;
  value: (control: FormControl) => FormControlValue | undefined;
  defaultValue: (control: FormControl) => FormControlValue;
  setValue: (control: FormControl, value: FormControlValue) => void;
  disabled: (control: FormControl) => boolean;
  reportValidity: (control: FormControl) => boolean;
}

export class FormController implements ReactiveController {
  private host: ReactiveControllerHost & FormControl;
  private form?: HTMLFormElement | null;
  private options: FormControllerOptions;

  public constructor(
    host: ReactiveControllerHost & FormControl,
    options?: Partial<FormControllerOptions>,
  ) {
    (this.host = host).addController(this);
    this.options = {
      form: (control) => {
        const formId = $(control).attr('form');

        if (formId) {
          const root = control.getRootNode() as Document | ShadowRoot;
          return root.getElementById(formId) as HTMLFormElement;
        }

        return control.closest('form');
      },
      name: (control) => control.name,
      value: (control) => control.value,
      defaultValue: (control) => control.defaultValue!,
      setValue: (control, value) => (control.value = value),
      disabled: (control) => control.disabled,
      reportValidity: (control) =>
        isFunction(control.reportValidity) ? control.reportValidity() : true,
      ...options,
    };
    this.onFormData = this.onFormData.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormReset = this.onFormReset.bind(this);
    this.reportFormValidity = this.reportFormValidity.bind(this);
  }

  public hostConnected(): void {
    this.form = this.options.form(this.host);

    if (this.form) {
      this.attachForm(this.form);
    }
  }

  public hostDisconnected(): void {
    this.detachForm();
  }

  public hostUpdated(): void {
    const form = this.options.form(this.host);

    if (!form) {
      this.detachForm();
    }

    if (form && this.form !== form) {
      this.detachForm();
      this.attachForm(form);
    }
  }

  /**
   * 获取当前表单控件关联的 `<form>` 元素
   */
  public getForm() {
    return this.form ?? null;
  }

  /**
   * 重置整个表单，所有表单控件恢复成默认值
   */
  public reset(invoker?: HTMLElement & { name: string; value: string }): void {
    this.doAction('reset', invoker);
  }

  /**
   * 提交整个表单
   */
  public submit(invoker?: HTMLElement & { name: string; value: string }): void {
    this.doAction('submit', invoker);
  }

  private attachForm(form?: HTMLFormElement): void {
    if (!form) {
      this.form = undefined;
      return;
    }

    this.form = form;

    if (formCollections.has(this.form)) {
      formCollections.get(this.form)!.add(this.host);
    } else {
      formCollections.set(this.form, new Set([this.host]));
    }

    this.form.addEventListener('formdata', this.onFormData);
    this.form.addEventListener('submit', this.onFormSubmit);
    this.form.addEventListener('reset', this.onFormReset);

    if (!reportValidityOverloads.has(this.form)) {
      reportValidityOverloads.set(this.form, this.form.reportValidity);
      this.form.reportValidity = () => this.reportFormValidity();
    }
  }

  private detachForm(): void {
    if (this.form) {
      formCollections.get(this.form)!.delete(this.host);

      this.form.removeEventListener('formdata', this.onFormData);
      this.form.removeEventListener('submit', this.onFormSubmit);
      this.form.removeEventListener('reset', this.onFormReset);

      if (
        reportValidityOverloads.has(this.form) &&
        !formCollections.get(this.form)!.size
      ) {
        this.form.reportValidity = reportValidityOverloads.get(this.form)!;
        reportValidityOverloads.delete(this.form);
      }
    }
  }

  private doAction(
    type: 'submit' | 'reset',
    invoker?: HTMLElement & { name: string; value: string },
  ): void {
    if (!this.form) {
      return;
    }

    const $button = $<HTMLButtonElement>(`<button type="${type}">`).css({
      position: 'absolute',
      width: 0,
      height: 0,
      clipPath: 'inset(50%)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    });
    const button = $button[0];

    if (invoker) {
      button.name = invoker.name;
      button.value = invoker.value;

      [
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
      ].forEach((attr) => {
        $button.attr(attr, $(invoker).attr(attr));
      });
    }

    this.form.append(button);
    button.click();
    button.remove();
  }

  private onFormData(event: FormDataEvent): void {
    const disabled = this.options.disabled(this.host);
    const name = this.options.name(this.host);
    const value = this.options.value(this.host);

    // 对于按钮，仅在 type="submit" 时，才提交值。已在 doAction() 方法中把 name、value 注入到 <button> 元素上
    const isButton = [
      'mdui-button',
      'mdui-button-icon',
      'mdui-chip',
      'mdui-fab',
      'mdui-segmented-button',
    ].includes(this.host.tagName.toLowerCase());

    if (
      !disabled &&
      !isButton &&
      isString(name) &&
      name &&
      !isUndefined(value)
    ) {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          event.formData.append(name, val.toString());
        });
      } else {
        event.formData.append(name, value.toString());
      }
    }
  }

  private onFormSubmit(event: Event): void {
    const disabled = this.options.disabled(this.host);
    const reportValidity = this.options.reportValidity;

    if (
      this.form &&
      !this.form.noValidate &&
      !disabled &&
      !reportValidity(this.host)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private onFormReset(): void {
    if (this.form) {
      this.options.setValue(this.host, this.options.defaultValue(this.host));

      // 取消 invalid 状态。
      // 此外，还需要在各个组件内，监听值的变更，判断 formResets 中是否存在当前表单控件。若存在则 invalid 设为 false；不存在则设置为 checkValidity() 的值
      // @ts-ignore
      this.host.invalid = false;

      if (formResets.has(this.form)) {
        formResets.get(this.form)!.add(this.host);
      } else {
        formResets.set(this.form, new Set([this.host]));
      }
    }
  }

  private reportFormValidity(): boolean {
    if (this.form && !this.form.noValidate) {
      for (const element of this.form.querySelectorAll<HTMLInputElement>('*')) {
        if (isFunction(element.reportValidity) && !element.reportValidity()) {
          return false;
        }
      }
    }

    return true;
  }
}
