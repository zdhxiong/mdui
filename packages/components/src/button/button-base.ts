import { LitElement, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { ClassInfo } from 'lit/directives/class-map.js';
import { RippleMixin } from '../shared/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './button-base-style.js';

export class ButtonBase extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  ripple!: Ripple;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ reflect: true })
  href!: string;

  @property({ reflect: true })
  download!: string;

  @property({ reflect: true })
  target!: string;

  @property({ reflect: true })
  rel!: string;

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
      rel,
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
      rel,
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
