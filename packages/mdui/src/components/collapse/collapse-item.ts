import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/on.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { collapseItemStyle } from './collapse-item-style.js';
import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event open - 开始打开时，事件被触发
 * @event opened - 打开动画完成时，事件被触发
 * @event close - 开始关闭时，事件被触发
 * @event closed - 关闭动画完成时，事件被触发
 *
 * @slot - 折叠面板项的正文内容
 * @slot header - 折叠面板项的头部内容
 *
 * @csspart header - 折叠面板的头部内容
 * @csspart body - 折叠面板的正文内容
 */
@customElement('mdui-collapse-item')
export class CollapseItem extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    collapseItemStyle,
  ];

  /**
   * 该折叠面板项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 该折叠面板项的头部文本
   */
  @property({ reflect: true })
  public header?: string;

  /**
   * 是否禁用该折叠面板项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 点击该元素时触发折叠，值可以是 DOM 元素或 CSS 选择器。默认为点击整个 header 区域触发
   */
  @property()
  public trigger?: HTMLElement | string;

  /**
   * 是否为激活状态，由 `collapse` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected active = false;

  @state()
  private state: 'open' | 'opened' | 'close' | 'closed' = 'closed';

  // 每一个 `collapse-item` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();
  private readonly bodyRef: Ref<HTMLElement> = createRef();

  @watch('active')
  private onActiveChange() {
    if (this.hasUpdated) {
      this.state = this.active ? 'open' : 'close';
      emit(this, this.state);
      this.updateBodyHeight();
    } else {
      this.state = this.active ? 'opened' : 'closed';
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    $(this.bodyRef.value!).on('transitionend', (e: unknown) => {
      const event = e as TransitionEvent;
      if (event.target === this.bodyRef.value) {
        this.state = this.active ? 'opened' : 'closed';
        emit(this, this.state);
        this.updateBodyHeight();
      }
    });

    this.updateBodyHeight();
  }

  protected override render(): TemplateResult {
    return html`<slot name="header" part="header" class="header">
        ${this.header}
      </slot>
      <slot
        part="body"
        class="body ${classMap({ opened: this.state === 'opened' })}"
        ${ref(this.bodyRef)}
      ></slot>`;
  }

  private updateBodyHeight() {
    const scrollHeight = this.bodyRef.value!.scrollHeight;

    // 如果是从 opened 状态开始关闭，则先设置高度值，并等重绘完成
    if (this.state === 'close') {
      $(this.bodyRef.value!).height(scrollHeight);
      this.bodyRef.value!.clientLeft;
    }

    $(this.bodyRef.value!).height(
      this.state === 'opened'
        ? 'auto'
        : this.state === 'open'
        ? scrollHeight
        : 0,
    );
  }
}
