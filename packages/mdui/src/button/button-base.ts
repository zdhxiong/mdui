import { LitElement, CSSResultGroup } from 'lit';
import { property } from '@mdui/shared/decorators.js';
import { ClassInfo } from '@mdui/shared/directives.js';
import { RippleMixin } from '@mdui/shared/mixins.js';
import { style } from './button-base-style.js';

export class ButtonBase extends RippleMixin(LitElement) {
  static styles: CSSResultGroup = style;

  /**
   * 是否使按钮浮动
   */
  @property({ type: Boolean, reflect: true })
  raised = false;

  /**
   * 是否取消按钮的阴影
   */
  @property({ type: Boolean, reflect: true })
  unelevated = false;

  /**
   * 是否使按钮包含轮廓
   */
  @property({ type: Boolean, reflect: true })
  outlined = false;

  /**
   * 是否使按钮更密集
   */
  @property({ type: Boolean, reflect: true })
  dense = false;

  /**
   * 是否使按钮宽度 100%
   */
  @property({ type: Boolean, reflect: true })
  fullwidth = false;

  /**
   * 图标
   */
  @property({ reflect: true })
  icon!: string;

  /**
   * 是否使图标位于右侧
   */
  @property({ type: Boolean, reflect: true })
  trailingIcon = false;

  protected getButtonClasses(): ClassInfo {
    const { raised, unelevated, outlined, dense, fullwidth } = this;

    return {
      raised,
      unelevated,
      outlined,
      dense,
      fullwidth,
    };
  }
}
