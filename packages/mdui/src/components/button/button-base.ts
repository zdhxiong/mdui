import { LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import RippleMixin from '../../mixins/ripple.js';
// @ts-ignore
import style from './button-base-style.js';

export default class ButtonBase extends RippleMixin(LitElement) {
  static styles = style;

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
  @property({ type: Boolean, reflect: true, attribute: 'trailingicon' })
  trailingIcon = false;

  protected getButtonClasses() {
    const { raised, unelevated, outlined, dense, fullwidth } = this;

    return classMap({
      raised,
      unelevated,
      outlined,
      dense,
      fullwidth
    });
  }
}
