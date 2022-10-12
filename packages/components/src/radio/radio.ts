import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { radioStyle } from './radio-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中该单选项时触发
 *
 * @slot - 文本
 *
 * @csspart control - 选择框
 * @csspart label - 文本
 */
@customElement('mdui-radio')
export class Radio extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [componentStyle, radioStyle];

  // 是否验证未通过。由 mdui-radio-group 控制该参数
  @state() protected invalid = false;

  // 是否可聚焦。由 mdui-radio-group 控制该参数
  @state() protected focusable = false;

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  protected get focusDisabled(): boolean {
    return this.disabled || !this.focusable;
  }

  protected get focusElement(): HTMLElement {
    return this;
  }

  protected get rippleDisabled(): boolean {
    return this.disabled;
  }

  /**
   * 当前 radio 选项的值
   */
  @property()
  public value!: string;

  /**
   * 是否禁用当前 radio 选项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public disabled = false;

  /**
   * 当前 radio 选项是否已选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public checked = false;

  override connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', () => {
      if (!this.disabled) {
        this.checked = true;
      }
    });
  }

  @watch('checked', true)
  protected onCheckedChange() {
    if (this.checked) {
      emit(this, 'change');
    }
  }

  protected override render(): TemplateResult {
    return html`<i part="control" class=${classMap({ invalid: this.invalid })}>
        <mdui-ripple></mdui-ripple>
      </i>
      <span part="label"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-radio': Radio;
  }
}
