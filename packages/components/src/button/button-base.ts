import { LitElement } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ClassInfo } from 'lit/directives/class-map.js';

export class ButtonBase extends LitElement {
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  href!: string;

  @property({ reflect: true })
  download!: string;

  @property({ reflect: true })
  target!: string;

  @property({ type: Boolean, reflect: true })
  autofocus = false;

  @property({ reflect: true })
  name!: string;

  @property({ reflect: true })
  value!: string;

  @property({ reflect: true })
  type!: string;

  @property({ reflect: true })
  form!: string;

  @property({ reflect: true })
  formAction!: string;

  @property({ reflect: true })
  formEnctype!: string;

  @property({ reflect: true })
  formMethod!: string;

  @property({ type: Boolean, reflect: true })
  formNovalidate = false;

  @property({ reflect: true })
  formTarget!: string;

  protected getButtonClasses(): ClassInfo {
    const {
      href,
      download,
      target,
      autofocus,
      name,
      value,
      type,
      form,
      formAction,
      formEnctype,
      formMethod,
      formNovalidate,
      formTarget,
    } = this;

    return {
      href,
      download,
      target,
      autofocus,
      name,
      value,
      type,
      form,
      formAction,
      formEnctype,
      formMethod,
      formNovalidate,
      formTarget,
    };
  }
}
