import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { navigationBarStyle } from './navigation-bar-style.js';
import type { NavigationBarItem as NavigationBarItemOriginal } from './navigation-bar-item.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type NavigationBarItem = NavigationBarItemOriginal & {
  labelVisibility: 'selected' | 'labeled' | 'unlabeled';
  active: boolean;
  readonly key: number;
};

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
  public static override styles: CSSResultGroup = [
    componentStyle,
    navigationBarStyle,
  ];

  /**
   * 是否隐藏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public hide = false;

  /**
   * 在页面向上滚动时，是否隐藏组件
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'hide-on-scroll',
  })
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

  /**
   * 当前选中的 `<mdui-navigation-bar-item>` 的值
   */
  @property()
  public value = '';

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

  // 因为 navigation-bar-item 的 value 可能会重复，所以在每个 navigation-bar-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKey = 0;

  private readonly uniqueId = uniqueId();
  private readonly scrollEventName = `scroll._navigation_bar_${this.uniqueId}`;

  // 上次滚动后，垂直方向的距离
  private lastScrollTop = 0;

  // 是否已完成初始 value 的设置。首次设置初始值时，不触发 change 事件
  private hasSetDefaultValue = false;

  // 所有的子项元素
  private get items() {
    return $(this)
      .find('mdui-navigation-bar-item')
      .get() as unknown as NavigationBarItem[];
  }

  /**
   * 组件需要监听该元素的滚动状态
   */
  private get scrollTargetListening(): HTMLElement | Window {
    return this.scrollTarget ? $(this.scrollTarget)[0] : window;
  }

  /**
   * 组件在该容器内滚动
   */
  private get scrollTargetContainer(): HTMLElement {
    return this.scrollTarget ? $(this.scrollTarget)[0] : document.body;
  }

  @watch('activeKey')
  private onActiveKeyChange() {
    // 根据 activeKey 读取对应 navigation-bar-item 的值
    this.value =
      this.items.find((item) => item.key === this.activeKey)?.value ?? '';

    if (this.hasSetDefaultValue) {
      emit(this, 'change');
    } else {
      this.hasSetDefaultValue = true;
    }
  }

  @watch('value')
  private onValueChange() {
    if (!this.value) {
      this.activeKey = 0;
    } else {
      const item = this.items.find((item) => item.value === this.value);
      this.activeKey = item ? item.key : 0;
    }

    this.updateActive();
  }

  @watch('scrollTarget')
  private onScrollTargetChange(
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
  private onHideOnScrollChange() {
    // hideOnScroll 为 false 时，为 scrollTargetContainer 元素添加 padding-bottom。避免 navigation-bar 覆盖内容
    $(this.scrollTargetContainer).css({
      'padding-bottom': this.hideOnScroll ? '' : this.offsetHeight,
    });
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    $(this.scrollTargetListening).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    $(this).on('transitionend', (event: TransitionEvent) => {
      if (event.target === this) {
        emit(this, this.hide ? 'hidden' : 'shown');
      }
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(this.scrollTargetListening).off(this.scrollEventName);
  }

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
    ></slot>`;
  }

  private onScroll() {
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

  private onClick(event: MouseEvent): void {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest(
      'mdui-navigation-bar-item',
    ) as NavigationBarItem;

    this.activeKey = item.key;
    this.updateActive();
  }

  private updateActive() {
    this.items.forEach((item) => (item.active = this.activeKey === item.key));
  }

  private onSlotChange() {
    const items = this.items;
    // 为 navigation-bar-item 设置 labelVisibility 属性
    const labelVisibility =
      this.labelVisibility === 'auto'
        ? items.length <= 3
          ? 'labeled'
          : 'selected'
        : this.labelVisibility;

    items.forEach((item) => {
      item.labelVisibility = labelVisibility;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar': NavigationBar;
  }
}
