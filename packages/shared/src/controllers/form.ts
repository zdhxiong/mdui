import { ReactiveController, ReactiveControllerHost } from 'lit';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';

export interface FormControllerOptions {
  form: (input: any) => HTMLFormElement | null;
  name: (input: any) => string | undefined;
  value: (
    input: any,
  ) => string | number | boolean | (string | number | boolean)[] | undefined;
  disabled: (input: any) => boolean;
  reportValidity: (input: any) => boolean;
}

export class FormController implements ReactiveController {
  host: ReactiveControllerHost & Element;
  form?: HTMLFormElement | null;
  options: FormControllerOptions;

  constructor(
    host: ReactiveControllerHost & Element,
    options?: Partial<FormControllerOptions>,
  ) {
    (this.host = host).addController(this);
    this.options = {
      form: (input) => (input as HTMLInputElement).closest('form'),
      name: (input) => (input as HTMLInputElement).name,
      value: (input) => (input as HTMLInputElement).value,
      disabled: (input) => (input as HTMLInputElement).disabled,
      reportValidity: (input) => {
        return typeof (input as HTMLInputElement).reportValidity === 'function'
          ? (input as HTMLInputElement).reportValidity()
          : true;
      },
      ...options,
    };
    this.onFormData = this.onFormData.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  hostConnected() {
    this.form = this.options.form(this.host);

    if (this.form) {
      $(this.form).on({
        formdata: this.onFormData,
        submit: this.onFormSubmit,
      });
    }
  }

  hostDisconnected() {
    if (this.form) {
      $(this.form).off({
        formdata: this.onFormData,
        submit: this.onFormSubmit,
      });
      this.form = undefined;
    }
  }

  protected onFormData(event: FormDataEvent) {
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

  protected onFormSubmit(event: Event) {
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

  public submit(submitter?: HTMLElement) {
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
