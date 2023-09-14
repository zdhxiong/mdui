import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/check.js';
import '@mdui/shared/icons/clear.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 纸片组件
 *
 * ```html
 * <mdui-chip>Chip</mdui-chip>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 文本
 * @slot icon - 左侧元素
 * @slot end-icon - 右侧元素
 * @slot selected-icon - 选中状态的左侧元素
 * @slot delete-icon - 可删除时，右侧的删除元素
 *
 * @csspart button - 内部的 `button` 或 `a` 元素
 * @csspart label - 文本
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart selected-icon - 选中状态的左侧图标
 * @csspart delete-icon - 可删除时，右侧的删除图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-chip')
export class Chip extends ButtonBase {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 纸片形状。可选值为：
   *
   * * `assist`：用于显示和当前上下文相关的辅助操作。例如在点餐页面，提供分享，收藏等功能
   * * `filter`：用于对内容进行筛选。例如在搜索结果页，对搜索结果进行过滤
   * * `input`：用于表示用户输入的信息片段。例如 Gmail 中“收件人”字段中的联系人
   * * `suggestion`：用于提供动态生成的推荐信息，以简化用户操作。例如在聊天应用中猜测用户可能想发送的信息，供用户选择
   */
  @property({ reflect: true })
  public variant:
    | /*用于显示和当前上下文相关的辅助操作。例如在点餐页面，提供分享，收藏等功能*/ 'assist'
    | /*用于对内容进行筛选。例如在搜索结果页，对搜索结果进行过滤*/ 'filter'
    | /*用于表示用户输入的信息片段。例如 Gmail 中“收件人”字段中的联系人*/ 'input'
    | /*用于提供动态生成的推荐信息，以简化用户操作。例如在聊天应用中猜测用户可能想发送的信息，供用户选择*/ 'suggestion' =
    'assist';

  /**
   * 是否包含阴影
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public elevated = false;

  /**
   * 是否可选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public selectable = false;

  /**
   * 是否为选中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public selected = false;

  /**
   * 是否可删除。为 `true` 时，在右侧会显示删除图标图标
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public deletable = false;

  /**
   * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 选中状态，左侧的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
   */
  @property({ reflect: true, attribute: 'selected-icon' })
  public selectedIcon?: string;

  /**
   * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  /**
   * 右侧的 Material Icons 图标名。也可以通过 `slot="delete-icon"` 设置
   */
  @property({ reflect: true, attribute: 'delete-icon' })
  public deleteIcon?: string;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'selected-icon',
    'end-icon',
  );

  public constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  @watch('selected', true)
  private onSelectedChange() {
    emit(this, 'change');
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeyDown);
  }

  protected override render(): TemplateResult {
    const hasIcon = this.icon || this.hasSlotController.test('icon');
    const hasEndIcon = this.endIcon || this.hasSlotController.test('end-icon');
    const hasSelectedIcon =
      this.selectedIcon ||
      ['assist', 'filter'].includes(this.variant) ||
      hasIcon ||
      this.hasSlotController.test('selected-icon');

    const className = cc({
      button: true,
      'has-icon':
        this.loading ||
        (!this.selected && hasIcon) ||
        (this.selected && hasSelectedIcon),
      'has-end-icon': hasEndIcon,
    });

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className,
            part: 'button',
            content: this.renderInner(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="${className} _a">
            ${this.renderInner()}
          </span>`
        : this.renderAnchor({
            className,
            part: 'button',
            content: this.renderInner(),
          })}`;
  }

  private onClick() {
    if (this.disabled || this.loading) {
      return;
    }

    // 点击时，切换选中状态
    if (this.selectable) {
      this.selected = !this.selected;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) {
      return;
    }

    // 按下空格键时，切换选中状态
    if (this.selectable && event.key === ' ') {
      event.preventDefault();
      this.selected = !this.selected;
    }

    // 按下 Delete 或 BackSpace 键时，触发 delete 事件
    if (this.deletable && ['Delete', 'Backspace'].includes(event.key)) {
      emit(this, 'delete');
    }
  }

  /**
   * 点击删除按钮
   */
  private onDelete(event: MouseEvent) {
    event.stopPropagation();
    emit(this, 'delete');
  }

  private renderIcon(): TemplateResult {
    if (this.loading) {
      return this.renderLoading();
    }

    const icon = (): TemplateResult => {
      return this.icon
        ? html`<mdui-icon name=${this.icon} class="i"></mdui-icon>`
        : nothingTemplate;
    };

    const selectedIcon = (): TemplateResult => {
      if (this.selectedIcon) {
        return html`<mdui-icon
          name="${this.selectedIcon}"
          class="i"
        ></mdui-icon>`;
      }

      if (this.variant === 'assist' || this.variant === 'filter') {
        return html`<mdui-icon-check class="i"></mdui-icon-check>`;
      }

      return icon();
    };

    return !this.selected
      ? html`<slot name="icon" part="icon" class="icon">${icon()}</slot>`
      : html`<slot
          name="selected-icon"
          part="selected-icon"
          class="selected-icon"
        >
          ${selectedIcon()}
        </slot>`;
  }

  private renderLabel(): TemplateResult {
    return html`<slot part="label" class="label"></slot>`;
  }

  private renderEndIcon(): TemplateResult {
    return html`<slot name="end-icon" part="end-icon" class="end-icon">
      ${this.endIcon
        ? html`<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderDeleteIcon(): TemplateResult {
    if (!this.deletable) {
      return nothingTemplate;
    }

    return html`<slot
      name="delete-icon"
      part="delete-icon"
      class="delete-icon"
      @click=${this.onDelete}
    >
      ${this.deleteIcon
        ? html`<mdui-icon name="${this.deleteIcon}" class="i"></mdui-icon>`
        : html`<mdui-icon-clear class="i"></mdui-icon-clear>`}
    </slot>`;
  }

  private renderInner(): TemplateResult[] {
    return [
      this.renderIcon(),
      this.renderLabel(),
      this.renderEndIcon(),
      this.renderDeleteIcon(),
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}
