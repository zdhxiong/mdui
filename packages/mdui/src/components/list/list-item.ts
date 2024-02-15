import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { isNodeName, getNodeName } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { listItemStyle } from './list-item-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 列表项组件。需配合 `<mdui-list>` 组件使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 主文本
 * @slot description - 副文本
 * @slot icon - 列表项左侧的元素
 * @slot end-icon - 列表项右侧的元素
 * @slot custom - 任意自定义内容
 *
 * @csspart container - 列表项容器
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart body - 中间部分
 * @csspart headline - 主标题
 * @csspart description - 副标题
 *
 * @cssprop --shape-corner - 列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-rounded - 指定了 `rounded` 属性时，列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-list-item')
export class ListItem extends AnchorMixin(
  RippleMixin(FocusableMixin(MduiElement)),
)<ListItemEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    listItemStyle,
  ];

  /**
   * 主文本。也可以通过 default slot 设置
   */
  @property({ reflect: true })
  public headline?: string;

  /**
   * 主文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
   *
   * * `1`：显示单行，超出后截断
   * * `2`：显示两行，超出后截断
   * * `3`：显示三行，超出后截断
   */
  @property({ type: Number, reflect: true, attribute: 'headline-line' })
  public headlineLine?:
    | /*显示单行，超出后截断*/ 1
    | /*显示两行，超出后截断*/ 2
    | /*显示三行，超出后截断*/ 3;

  /**
   * 副文本。也可以通过 `slot="description"` 设置
   */
  @property({ reflect: true })
  public description?: string;

  /**
   * 副文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
   *
   * * `1`：显示单行，超出后截断
   * * `2`：显示两行，超出后截断
   * * `3`：显示三行，超出后截断
   */
  @property({ type: Number, reflect: true, attribute: 'description-line' })
  public descriptionLine?:
    | /*显示单行，超出后截断*/ 1
    | /*显示两行，超出后截断*/ 2
    | /*显示三行，超出后截断*/ 3;

  /**
   * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  /**
   * 是否禁用该列表项，禁用后，列表项将变为灰色，且其中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等也将禁用
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 是否激活该列表项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public active = false;

  /**
   * 是否使列表项不可点击。设置后，列表项中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等仍可交互
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public nonclickable = false;

  /**
   * 是否使用圆角形状的列表项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public rounded = false;

  /**
   * 列表项的垂直对齐方式。可选值包括：
   *
   * * `start`：顶部对齐
   * * `center`：居中对齐
   * * `end`：底部对齐
   */
  @property({ reflect: true })
  public alignment:
    | /*顶部对齐*/ 'start'
    | /*居中对齐*/ 'center'
    | /*底部对齐*/ 'end' = 'center';

  @queryAssignedElements({ slot: 'icon', flatten: true })
  private readonly iconElements!: HTMLElement[];

  @queryAssignedElements({ slot: 'end-icon', flatten: true })
  private readonly endIconElements!: HTMLElement[];

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly itemRef: Ref<HTMLElement> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'description',
    'icon',
    'end-icon',
    'custom',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.focusDisabled;
  }

  protected override get focusElement(): HTMLElement {
    return this.href && !this.disabled ? this.itemRef.value! : this;
  }

  protected override get focusDisabled(): boolean {
    return this.href ? this.disabled : this.disabled || this.nonclickable;
  }

  protected override render(): TemplateResult {
    const preset = !this.hasSlotController.test('custom');
    const hasIcon = this.icon || this.hasSlotController.test('icon');
    const hasEndIcon = this.endIcon || this.hasSlotController.test('end-icon');
    const hasDescription =
      this.description || this.hasSlotController.test('description');

    const className = cc({
      container: true,
      preset,
      'has-icon': hasIcon,
      'has-end-icon': hasEndIcon,
      'has-description': hasDescription,
      // icon slot 中的元素是否为 mdui-icon 或 mdui-icon-* 组件
      'is-icon': isNodeName(this.iconElements[0], 'mdui-icon'),
      // end-icon slot 中的元素是否为 mdui-icon 或 mdui-icon-* 组件
      'is-end-icon': getNodeName(this.endIconElements[0]).startsWith(
        'mdui-icon-',
      ),
    });

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.href && !this.disabled
        ? this.renderAnchor({
            className,
            content: this.renderInner(),
            part: 'container',
            refDirective: ref(this.itemRef),
          })
        : html`<div part="container" class="${className}" ${ref(this.itemRef)}>
            ${this.renderInner()}
          </div>`}`;
  }

  private renderInner(): TemplateResult {
    const hasDefaultSlot = this.hasSlotController.test('[default]');

    return html`<slot name="custom">
      <slot name="icon" part="icon" class="icon">
        ${this.icon
          ? html`<mdui-icon name=${this.icon}></mdui-icon>`
          : nothingTemplate}
      </slot>
      <div part="body" class="body">
        ${hasDefaultSlot
          ? html`<slot part="headline" class="headline"></slot>`
          : html`<div part="headline" class="headline">${this.headline}</div>`}
        <slot name="description" part="description" class="description">
          ${this.description}
        </slot>
      </div>
      <slot name="end-icon" part="end-icon" class="end-icon">
        ${this.endIcon
          ? html`<mdui-icon name=${this.endIcon}></mdui-icon>`
          : nothingTemplate}
      </slot>
    </slot>`;
  }
}

export interface ListItemEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list-item': ListItem;
  }
}
