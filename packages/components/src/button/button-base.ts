import { LitElement, CSSResultGroup, TemplateResult, html } from 'lit';
import { query } from 'lit/decorators/query.js';
import { property } from 'lit/decorators/property.js';
import { when } from 'lit/directives/when.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { ButtonMixin } from '@mdui/shared/mixins/button.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { buttonBaseStyle } from './button-base-style.js';
import '../circular-progress.js';

export class ButtonBase extends ButtonMixin(
  AnchorMixin(RippleMixin(FocusableMixin(LitElement))),
) {
  static override styles: CSSResultGroup = [componentStyle, buttonBaseStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  protected readonly formController: FormController = new FormController(this, {
    form: (button: ButtonBase) => {
      if (button.hasAttribute('form')) {
        const document = button.getRootNode() as Document | ShadowRoot;
        const formId = button.getAttribute('form')!;
        return document.getElementById(formId) as HTMLFormElement;
      }

      return button.closest('form');
    },
  });

  /**
   * 是否为加载中状态
   */
  @property({ type: Boolean, reflect: true })
  public loading = false;

  protected get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected get focusableDisabled(): boolean {
    return this.disabled || this.loading;
  }

  @watch('disabled')
  @watch('loading')
  protected _() {
    // @ts-ignore
    this.onDisabledUpdate();
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
