import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import '@mdui/shared/icons/circle.js';
import '@mdui/shared/icons/radio-button-unchecked.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { radioStyle } from './radio-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 单选框组件。需与 `<mdui-radio-group>` 组件配合使用
 *
 * ```html
 * <mdui-radio-group value="chinese">
 * ..<mdui-radio value="chinese">Chinese</mdui-radio>
 * ..<mdui-radio value="english">English</mdui-radio>
 * </mdui-radio-group>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中该单选项时触发
 *
 * @slot - 文本
 * @slot unchecked-icon - 未选中状态的图标
 * @slot checked-icon - 选中状态的图标
 *
 * @csspart control - 左侧图标容器
 * @csspart unchecked-icon 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 * @csspart label - 文本
 */
@customElement('mdui-radio')
export class Radio extends RippleMixin(FocusableMixin(LitElement)) {
  public static override styles: CSSResultGroup = [componentStyle, radioStyle];

  /**
   * 当前单选项的值
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 是否禁用当前单选项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 当前单选项是否已选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public checked = false;

  /**
   * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
   */
  @property({ reflect: true, attribute: 'unchecked-icon' })
  public uncheckedIcon?: string;

  /**
   * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
   */
  @property({ reflect: true, attribute: 'checked-icon' })
  public checkedIcon?: string;

  // 是否验证未通过。由 mdui-radio-group 控制该参数
  @state()
  protected invalid = false;

  // 父组件中是否设置了禁用。由 mdui-radio-group 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'group-disabled',
  })
  protected groupDisabled = false;

  // 是否可聚焦。
  // 单独使用该组件时，默认可聚焦。
  // 如果放在 <mdui-radio-group> 组件中使用，则由 <mdui-radio-group> 控制该参数
  @state()
  protected focusable = true;

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
    const className = classMap({
      invalid: this.invalid,
    });

    return html`<i part="control" class=${className}>
        <mdui-ripple
          ${ref(this.rippleRef)}
          .noRipple=${this.noRipple}
        ></mdui-ripple>
        <slot
          name="unchecked-icon"
          part="unchecked-icon"
          class="icon unchecked-icon"
        >
          ${this.uncheckedIcon
            ? html`<mdui-icon name=${this.uncheckedIcon} class="i"></mdui-icon>`
            : html`<mdui-icon-radio-button-unchecked
                class="i"
              ></mdui-icon-radio-button-unchecked>`}
        </slot>
        <slot name="checked-icon" part="checked-icon" class="icon checked-icon">
          ${this.checkedIcon
            ? html`<mdui-icon name=${this.checkedIcon} class="i"></mdui-icon>`
            : html`<mdui-icon-circle class="i"></mdui-icon-circle>`}
        </slot>
      </i>
      <slot part="label" class="label ${className}"></slot>`;
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
