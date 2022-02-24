import { LitElement, CSSResultGroup } from 'lit';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor-mixin.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './button-base-style.js';

export class ButtonBase extends AnchorMixin(RippleMixin(LitElement)) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @property({ type: Boolean, reflect: true })
  public disabled = false;

  @property({ type: Boolean, reflect: true })
  public autofocus = false;

  @property({ reflect: true })
  public name!: string;

  @property({ reflect: true })
  public value!: string;

  @property({ reflect: true })
  public type!: 'submit' | 'reset' | 'button';

  @property({ reflect: true })
  public form!: string;

  @property({ reflect: true })
  public formAction!: string;

  @property({ reflect: true })
  public formEnctype!:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';

  @property({ reflect: true })
  public formMethod!: 'post' | 'get';

  @property({ type: Boolean, reflect: true })
  public formNovalidate = false;

  @property({ reflect: true })
  public formTarget!: '_self' | '_blank' | '_parent' | '_top';
}
