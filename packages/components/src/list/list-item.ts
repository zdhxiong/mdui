import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { query } from 'lit/decorators/query.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { listItemStyle } from './list-item-style.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 任意内容
 * @slot title - 主文本
 * @slot subtitle - 副文本
 * @slot start - 左侧 slot
 * @slot end - 右侧 slot
 *
 * @csspart start - 左侧 slot
 * @csspart end - 右侧 slot
 * @csspart body - 中间部分
 * @csspart title - 主标题
 * @csspart subtitle - 副标题
 */
@customElement('mdui-list-item')
export class ListItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  static override styles: CSSResultGroup = [componentStyle, listItemStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @query('.item')
  protected item!: HTMLElement;

  protected get focusProxiedElement(): HTMLElement {
    return this.item;
  }

  protected get focusableDisabled(): boolean {
    return this.href ? this.disabled : this.disabled || this.nonclickable;
  }

  protected get rippleDisabled(): boolean {
    return this.href ? this.disabled : this.disabled || this.nonclickable;
  }

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'title',
    'subtitle',
    'start',
    'end',
  );

  /**
   * 主文本
   */
  @property({ reflect: true })
  public title!: string;

  /**
   * 副文本
   */
  @property({ reflect: true })
  public subtitle!: string;

  /**
   * 是否禁用该列表项，列表项将置灰，且其中的 checkbox、radio、switch 等都将禁用
   */
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 是否激活该列表项
   */
  @property({ type: Boolean, reflect: true })
  public active = false;

  /**
   * 是否使列表项不可点击，但其中的 checkbox、radio、switch 等仍可进行交互
   */
  @property({ type: Boolean, reflect: true })
  public nonclickable = false;

  /**
   * 使用圆角形状的列表项
   */
  @property({ type: Boolean, reflect: true })
  public rounded = false;

  protected renderInner(): TemplateResult {
    const { title, subtitle } = this;
    const hasTitleSlot = this.hasSlotController.test('title');
    const hasSubtitleSlot = this.hasSlotController.test('subtitle');
    const hasStartSlot = this.hasSlotController.test('start');
    const hasEndSlot = this.hasSlotController.test('end');

    return html`<div
        part="start"
        class="start ${classMap({ 'has-start': hasStartSlot })}"
      >
        <slot name="start"></slot>
      </div>
      <div
        part="body"
        class="body ${classMap({
          'with-title': title || hasTitleSlot,
          'with-subtitle': subtitle || hasSubtitleSlot,
        })}"
      >
        <div
          part="title"
          class="title ${classMap({ 'has-title': title || hasTitleSlot })}"
        >
          <slot name="title"></slot>${title}
        </div>
        <div
          part="subtitle"
          class="subtitle ${classMap({
            'has-subtitle': subtitle || hasSubtitleSlot,
          })}"
        >
          <slot name="subtitle"></slot>${subtitle}
        </div>
      </div>
      <div part="end" class="end ${classMap({ 'has-end': hasEndSlot })}">
        <slot name="end"></slot>
      </div>
      <slot></slot>`;
  }

  protected override render(): TemplateResult {
    const { disabled, href } = this;

    return html`<mdui-ripple></mdui-ripple>${href && !disabled
        ? // @ts-ignore
          this.renderAnchor({
            className: 'item',
            content: this.renderInner(),
          })
        : html`<div class="item">${this.renderInner()}</div>`}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list-item': ListItem;
  }
}
