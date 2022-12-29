import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { ButtonMixin } from '@mdui/shared/mixins/button.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../circular-progress.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { buttonBaseStyle } from './button-base-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(FocusableMixin(LitElement))),
) {
  static override styles: CSSResultGroup = [componentStyle, buttonBaseStyle];

  private readonly formController: FormController = new FormController(this);

  protected override get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected override get focusElement(): HTMLElement | null {
    return this.href
      ? this.renderRoot?.querySelector('._a')
      : this.renderRoot?.querySelector('._button');
  }

  public override connectedCallback(): void {
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
