import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { ButtonMixin } from '@mdui/shared/mixins/button.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../circular-progress.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { buttonBaseStyle } from './button-base-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(FocusableMixin(LitElement))),
) {
  static override styles: CSSResultGroup = [componentStyle, buttonBaseStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  protected readonly formController: FormController = new FormController(this);

  protected get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected get focusElement(): HTMLElement {
    return this.href
      ? this.renderRoot.querySelector('._a')!
      : this.renderRoot.querySelector('._button')!;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', () => {
      if (this.type === 'submit') {
        this.formController.submit(this);
      }
    });
  }

  protected renderLoading(): TemplateResult {
    return when(
      this.loading,
      () =>
        html`<mdui-circular-progress part="loading"></mdui-circular-progress>`,
    );
  }
}
