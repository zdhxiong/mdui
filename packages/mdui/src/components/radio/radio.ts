import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../../icons/radio-button-unchecked.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { radioStyle } from './radio-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中该单选项时触发
 *
 * @slot - 文本
 *
 * @csspart control - 选择框
 * @csspart unchecked-icon 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 * @csspart label - 文本
 */
@customElement('mdui-radio')
export class Radio extends RippleMixin(FocusableMixin(LitElement)) {
  public static override styles: CSSResultGroup = [componentStyle, radioStyle];

  /**
   * 当前 radio 选项的值
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 是否禁用当前 radio 选项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 当前 radio 选项是否已选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public checked = false;

  // 是否验证未通过。由 mdui-radio-group 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected invalid = false;

  // 父组件中是否设置了禁用。由 mdui-radio-group 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'group-disabled',
  })
  protected groupDisabled = false;

  // 是否可聚焦。由 mdui-radio-group 控制该参数
  @state()
  protected focusable = false;

  private readonly rippleRef: Ref<Ripple> = createRef();

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.isDisabled();
  }

  protected override get focusElement(): HTMLElement {
    return this;
  }

  protected override get focusDisabled(): boolean {
    return this.isDisabled() || !this.focusable;
  }

  @watch('checked', true)
  private onCheckedChange() {
    if (this.checked) {
      emit(this, 'change');
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', () => {
      if (!this.isDisabled()) {
        this.checked = true;
      }
    });
  }

  protected override render(): TemplateResult {
    return html`<i part="control">
        <mdui-ripple
          ${ref(this.rippleRef)}
          .noRipple=${this.noRipple}
        ></mdui-ripple>
        <mdui-icon-radio-button-unchecked
          part="unchecked-icon"
          class="unchecked-icon"
        ></mdui-icon-radio-button-unchecked>
        <div part="checked-icon" class="checked-icon"></div>
      </i>
      <span part="label"><slot></slot></span>`;
  }

  private isDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-radio': Radio;
  }
}
