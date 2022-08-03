import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { query, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { ButtonMixin } from '@mdui/shared/mixins/button.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import type { Ripple } from '../ripple/index.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { buttonBaseStyle } from './button-base-style.js';
import '../circular-progress.js';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(FocusableMixin(LitElement))),
) {
  static override styles: CSSResultGroup = [componentStyle, buttonBaseStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  protected readonly formController: FormController = new FormController(this);

  /**
   * 是否为加载中状态
   */
  @property({ type: Boolean, reflect: true })
  public loading = false;

  protected get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected get focusElement(): HTMLElement {
    return this;
  }

  connectedCallback() {
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
