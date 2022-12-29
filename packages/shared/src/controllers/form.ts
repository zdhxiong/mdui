import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

/* eslint-disable */
export interface FormControllerOptions {
  form: (input: any) => HTMLFormElement | null;
  name: (input: any) => string | undefined;
  value: (
    input: any,
  ) => string | number | boolean | (string | number | boolean)[] | undefined;
  disabled: (input: any) => boolean;
  reportValidity: (input: any) => boolean;
}
/* eslint-enable */

export class FormController implements ReactiveController {
  private host: ReactiveControllerHost & Element;
  private form?: HTMLFormElement | null;
  private options: FormControllerOptions;

  public constructor(
    host: ReactiveControllerHost & Element,
    options?: Partial<FormControllerOptions>,
  ) {
    (this.host = host).addController(this);
    this.options = {
      form: (input) => {
        if (input.hasAttribute('form')) {
          const document = input.getRootNode() as Document | ShadowRoot;
          const formId = input.getAttribute('form')!;
          return document.getElementById(formId) as HTMLFormElement;
        }

        return input.closest('form');
      },
      name: (input) => input.name,
      value: (input) => input.value,
      disabled: (input) => input.disabled,
      reportValidity: (input) => {
        return typeof input.reportValidity === 'function'
          ? input.reportValidity()
          : true;
      },
      ...options,
    };
    this.onFormData = this.onFormData.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  public hostConnected(): void {
    this.form = this.options.form(this.host);

    if (this.form) {
      $(this.form).on({
        formdata: this.onFormData,
        submit: this.onFormSubmit,
      });
    }
  }

  public hostDisconnected(): void {
    if (this.form) {
      $(this.form).off({
        formdata: this.onFormData,
        submit: this.onFormSubmit,
      });
      this.form = undefined;
    }
  }

  private onFormData(event: FormDataEvent): void {
    const disabled = this.options.disabled(this.host);
    const name = this.options.name(this.host);
    const value = this.options.value(this.host);

    if (!disabled && typeof name === 'string' && typeof value !== 'undefined') {
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

  public submit(submitter?: HTMLElement): void {
    if (!this.form) {
      return;
    }

    const $button = $('<button type="submit">').css({
      position: 'absolute',
      width: 0,
      height: 0,
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    });
    const button = $button[0];

    if (submitter) {
      [
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
      ].forEach((attr) => {
        if (!submitter.hasAttribute(attr)) {
          return;
        }

        button.setAttribute(attr, submitter.getAttribute(attr)!);
      });
    }

    this.form.append(button);
    button.click();
    button.remove();
  }
}
