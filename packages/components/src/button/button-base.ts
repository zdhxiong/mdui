import { LitElement, CSSResultGroup } from 'lit';
import { query } from 'lit/decorators/query.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { ButtonMixin } from '@mdui/shared/mixins/button.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { buttonBaseStyle } from './button-base-style.js';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(FocusableMixin(LitElement))),
) {
  static override styles: CSSResultGroup = [componentStyle, buttonBaseStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;
}
