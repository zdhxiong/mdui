import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/css.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { navigationBarStyle } from './navigation-bar-style.js';
import type { NavigationBarItem } from './navigation-bar-item.js';

/**
 * @event click - 点击时触发
 * @event change - 值变化时触发
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - `<mdui-navigation-bar-item>` 组件
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-navigation-bar')
export class NavigationBar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, navigationBarStyle];

  @queryAssignedElements({
    selector: 'mdui-navigation-bar-item',
    flatten: true,
  })
  protected itemElements!: NavigationBarItem[] | null;

  protected readonly uniqueId = uniqueId();
  protected readonly scrollEventName = `scroll._navigation_bar_${this.uniqueId}`;

  /**
   * 是否隐藏
   */
  @property({ type: Boolean, reflect: true })
  public hide = false;

  /**
   * 在页面向上滚动时，是否隐藏组件
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-on-scroll' })
  public hideOnScroll = false;

  /**
   * 文本的可视状态。可选值为：
   * * `auto`
   * * `selected`
   * * `labeled`
   * * `unlabeled`
   */
  @property({ reflect: true, attribute: 'label-visibility' })
  public labelVisibility:
    | 'auto' /*小于等于3个选项时，始终显示；大于3个选项时，仅显示选中状态的文本*/
    | 'selected' /*仅选中状态显示文本*/
    | 'labeled' /*始终显示文本*/
    | 'unlabeled' /*始终不显示文本*/ = 'auto';

  private _value = '';

  /**
   * 当前选中的选项的 value 值
   */
  @property({ reflect: true })
  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    const oldValue = this.value;
    if (value === oldValue) {
      return;
    }

    this._value = value;
    this.updateComplete.then(() => {
      const itemElement = this.itemElements?.find(
        (itemElement) => itemElement.value === value,
      );
      if (itemElement) {
        this.selectItem(itemElement);
      }
    });
    this.requestUpdate('value', oldValue);
  }

  /**
   * 需要监听其滚动事件的元素的 CSS 选择器。默认为监听 window 滚动
   */
  @property({ reflect: true, attribute: 'scroll-target' })
  public scrollTarget!: string;

  /**
   * 在 hide-on-scroll 激活之前的滚动距离
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-threshold' })
  public scrollThreshold!: number;

  /**
   * 组件需要监听该元素的滚动状态
   */
  protected get scrollTargetListening(): HTMLElement | Window {
    return this.scrollTarget ? $(this.scrollTarget)[0] : window;
  }

  /**
   * 组件在该容器内滚动
   */
  protected get scrollTargetContainer(): HTMLElement {
    return this.scrollTarget ? $(this.scrollTarget)[0] : document.body;
  }

  override connectedCallback() {
    super.connectedCallback();
    $(this.scrollTargetListening).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    $(this).on('transitionend', (e: TransitionEvent) => {
      if (e.target === this) {
        emit(this, this.hide ? 'hidden' : 'shown');
      }
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    $(this.scrollTargetListening).off(this.scrollEventName);
  }

  @watch('scrollTarget')
  protected onScrollTargetChange(
    oldScrollTarget: string,
    newScrollTarget: string,
  ) {
    $(oldScrollTarget ?? window).off(this.scrollEventName);
    $(newScrollTarget).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    this.onScroll();
  }

  @watch('hideOnScroll')
  protected onHideOnScrollChange() {
    // hideOnScroll 为 false 时，为 scrollTargetContainer 元素添加 padding-bottom。避免 navigation-bar 覆盖内容
    $(this.scrollTargetContainer).css({
      'padding-bottom': this.hideOnScroll ? '' : this.offsetHeight,
    });
  }

  private lastScrollTop = 0; // 上次滚动后，垂直方向的距离
  protected onScroll() {
    if (!this.hideOnScroll) {
      return;
    }

    const scrollTop =
      (this.scrollTargetListening as Window).scrollY ||
      (this.scrollTargetListening as HTMLElement).scrollTop;

    if (
      Math.abs(scrollTop - this.lastScrollTop) <= (this.scrollThreshold || 0)
    ) {
      return;
    }

    if (scrollTop > this.lastScrollTop && !this.hide) {
      const requestHide = emit(this, 'hide');
      if (!requestHide.defaultPrevented) {
        this.hide = true;
      }
    } else if (scrollTop < this.lastScrollTop && this.hide) {
      const requestShow = emit(this, 'show');
      if (!requestShow.defaultPrevented) {
        this.hide = false;
      }
    }

    this.lastScrollTop = scrollTop;
  }

  public constructor() {
    super();

    this.addEventListener('click', this.onClick);
  }

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }

  private onClick(event: Event): void {
    const item = event
      .composedPath()
      .find(
        (el) => (el as NavigationBarItem).parentElement === this,
      ) as NavigationBarItem;

    if (!item) {
      return;
    }

    this.selectItem(item);
  }

  private selectItem(item: NavigationBarItem): void {
    const value = item.value;
    if (!value || this.value === value) {
      return;
    }

    this.value = value;
    emit(this, 'change');

    (this.itemElements ?? []).forEach((itemElement) => {
      itemElement.active = itemElement.value === value;
    });
  }

  protected onSlotChange() {
    const itemElements = this.itemElements ?? [];
    // 为 navigation-bar-item 设置 labelVisibility 属性
    const labelVisibility =
      this.labelVisibility === 'auto'
        ? itemElements.length <= 3
          ? 'labeled'
          : 'selected'
        : this.labelVisibility;

    itemElements.forEach((itemElement) => {
      // @ts-ignore
      itemElement.labelVisibility = labelVisibility;
    });

    // 为 navigation-bar-item 的 value 填充默认值
    itemElements.forEach((itemElement, index) => {
      if (!itemElement.value) {
        itemElement.value = index.toString();
      }
    });

    // 未设置 navigation-bar 的 value 属性时，根据 navigation-bar-item 的 active 来设置
    if (!this.value) {
      this.value =
        itemElements.find((itemElement) => itemElement.active)?.value ?? '';
    }

    // 未设置 navigation-bar 的 value，也未设置 navigation-bar-item 的 active，则默认选中第一个
    if (!this.value) {
      this.value = itemElements[0].value;
    }

    // 重新选中默认值
    itemElements.forEach((itemElement) => {
      itemElement.active = itemElement.value === this.value;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar': NavigationBar;
  }
}
