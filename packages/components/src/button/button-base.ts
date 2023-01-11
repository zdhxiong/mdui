import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { emit } from '@mdui/shared/helpers/event.js';
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
  public static override styles: CSSResultGroup = [
    componentStyle,
    buttonBaseStyle,
  ];

  private readonly formController: FormController = new FormController(this);

  /**
   * 表单验证状态对象
   */
  public get validity(): ValidityState | undefined {
    if (this.isButton()) {
      return (this.focusElement as HTMLButtonElement).validity;
    }
  }

  /**
   * 表单验证的错误提示信息
   */
  public get validationMessage(): string | undefined {
    if (this.isButton()) {
      return (this.focusElement as HTMLButtonElement).validationMessage;
    }
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected override get focusElement(): HTMLElement | null {
    return this.isButton()
      ? this.renderRoot?.querySelector('._button')
      : this.renderRoot?.querySelector('._a');
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', () => {
      if (this.type === 'submit') {
        this.formController.submit(this);
      }

      if (this.type === 'reset') {
        this.formController.reset(this);
      }
    });
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity() {
    if (this.isButton()) {
      const valid = (this.focusElement as HTMLButtonElement).checkValidity();

      if (!valid) {
        emit(this, 'invalid', {
          bubbles: false,
          cancelable: true,
          composed: false,
        });
      }

      return valid;
    }

    return true;
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity() {
    if (this.isButton()) {
      const invalid = !(
        this.focusElement as HTMLButtonElement
      ).reportValidity();

      if (invalid) {
        emit(this, 'invalid', {
          bubbles: false,
          cancelable: true,
          composed: false,
        });

        // todo 考虑是否要支持 preventDefault() 方法，当前 invalid 状态没有样式
      }

      return !invalid;
    }

    return true;
  }

  /**
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string) {
    if (this.isButton()) {
      (this.focusElement as HTMLButtonElement).setCustomValidity(message);
    }
  }

  protected renderLoading(): TemplateResult {
    return when(
      this.loading,
      () =>
        html`<mdui-circular-progress part="loading"></mdui-circular-progress>`,
    );
  }

  protected isButton(): boolean {
    return !this.href;
  }
}
