import { LitElement, CSSResultGroup } from 'lit';
import { query } from 'lit/decorators/query.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor-mixin.js';
import { ButtonMixin } from '@mdui/shared/mixins/button-mixin.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './button-base-style.js';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(LitElement)),
) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;
}
