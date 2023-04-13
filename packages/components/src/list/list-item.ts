import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { listItemStyle } from './list-item-style.js';
import type { MaterialIconsName } from '../icon/index.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 主文本
 * @slot secondary - 副文本
 * @slot start - 左侧 slot
 * @slot end - 右侧 slot
 * @slot custom - 任意自定义内容
 *
 * @csspart start - 左侧 slot
 * @csspart end - 右侧 slot
 * @csspart body - 中间部分
 * @csspart primary - 主标题
 * @csspart secondary - 副标题
 *
 * @cssprop --shape-corner 列表项的圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 * @cssprop --shape-corner-rounded 指定了 `rounded` 时，列表项的圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-list-item')
export class ListItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    listItemStyle,
  ];

  /**
   * 主文本
   */
  @property({ reflect: true })
  public primary?: string;

  /**
   * 主文本行数，超过行数限制后会截断显示。默认为没有行数限制
   */
  @property({ type: Number, reflect: true, attribute: 'primary-line' })
  public primaryLine?: 1 | 2 | 3;

  /**
   * 副文本
   */
  @property({ reflect: true })
  public secondary?: string;

  /**
   * 副文本行数，超过行数限制后会截断显示。默认为没有行数限制
   */
  @property({ type: Number, reflect: true, attribute: 'secondary-line' })
  public secondaryLine?: 1 | 2 | 3;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: MaterialIconsName;

  /**
   * 是否禁用该列表项，列表项将置灰，且其中的 checkbox、radio、switch 等都将禁用
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
   * 是否使列表项不可点击，但其中的 checkbox、radio、switch 等仍可进行交互
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public nonclickable = false;

  /**
   * 使用圆角形状的列表项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public rounded = false;

  /**
   * 列表项的垂直对齐方式。可选值为：
   * * `start`：顶部对齐
   * * `center`：居中对齐
   * * `end`：底部对齐
   */
  @property({ reflect: true })
  public alignment: 'start' | 'center' | 'end' = 'center';

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly itemRef: Ref<HTMLElement> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'secondary',
    'start',
    'end',
    'custom',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.focusDisabled;
  }

  protected override get focusElement(): HTMLElement {
    return this.href ? this.itemRef.value! : this;
  }

  protected override get focusDisabled(): boolean {
    return this.href ? this.disabled : this.disabled || this.nonclickable;
  }

  protected override render(): TemplateResult {
    const hasCustomSlot = this.hasSlotController.test('custom');
    const hasStartSlot = this.hasSlotController.test('start');
    const hasEndSlot = this.hasSlotController.test('end');
    const hasSecondarySlot = this.hasSlotController.test('secondary');

    const className = cc({
      item: true,
      preset: !hasCustomSlot,
      'has-start': this.icon || hasStartSlot,
      'has-end': this.endIcon || hasEndSlot,
      'has-secondary': this.secondary || hasSecondarySlot,
    });

    return html`<mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>${this.href &&
      !this.disabled
        ? this.renderAnchor({
            className,
            content: this.renderInner(),
            refDirective: ref(this.itemRef),
          })
        : html`<div class="${className}" ${ref(this.itemRef)}>
            ${this.renderInner()}
          </div>`}`;
  }

  private renderInner(): TemplateResult {
    const hasDefaultSlot = this.hasSlotController.test('[default]');

    return html`<slot name="custom">
      <slot name="start">
        ${this.icon
          ? html`<mdui-icon
              part="start"
              class="start"
              name=${this.icon}
            ></mdui-icon>`
          : nothingTemplate}
      </slot>
      <div part="body" class="body">
        <div part="primary" class="primary">
          ${hasDefaultSlot ? html`<slot></slot>` : this.primary}
        </div>
        <div part="secondary" class="secondary">
          <slot name="secondary">${this.secondary}</slot>
        </div>
      </div>
      <slot name="end">
        ${this.endIcon
          ? html`<mdui-icon
              part="end"
              class="end"
              name=${this.endIcon}
            ></mdui-icon>`
          : nothingTemplate}
      </slot>
    </slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list-item': ListItem;
  }
}
