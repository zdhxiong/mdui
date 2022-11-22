import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/innerWidth.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { navigationRailStyle } from './navigation-rail-style.js';
import type { NavigationRailItem as NavigationRailItemOriginal } from './navigation-rail-item.js';
import type { CSSResultGroup } from 'lit';

type NavigationRailItem = NavigationRailItemOriginal & {
  active: boolean;
  placement: 'left' | 'right';
  readonly key: number;
};

/**
 * @event click - 点击时触发
 * @event change - 值变化时触发
 *
 * @slot - `<mdui-navigation-rail-item>` 组件
 * @slot top - 顶部的元素
 * @slot bottom - 底部的元素
 *
 * @csspart top - 顶部元素的容器
 * @csspart bottom - 底部元素的容器
 * @csspart items - `<mdui-navigation-rail-item>` 组件的容器
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-navigation-rail')
export class NavigationRail extends LitElement {
  static override styles: CSSResultGroup = [
    componentStyle,
    navigationRailStyle,
  ];

  private readonly hasSlotController = new HasSlotController(
    this,
    'top',
    'bottom',
  );

  // 所有的子项元素
  protected get items() {
    return $(this)
      .find('mdui-navigation-rail-item')
      .get() as unknown as NavigationRailItem[];
  }

  // 因为 navigation-rail-item 的 value 可能会重复，所以在每个 navigation-rail-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKey = 0;

  private get parentTarget() {
    return this.contained ? this.parentElement! : document.body;
  }

  /**
   * 当前选中的 `<mdui-navigation-bar-item>` 的值
   */
  @property()
  public value = '';

  /**
   * 导航栏的位置。可选值为：
   * * `left`
   * * `right`
   */
  @property({ reflect: true })
  public placement: 'left' | 'right' = 'left';

  /**
   * 导航栏中的 `<mdui-navigation-rail-item>` 元素的对齐方式。可选值为：
   * * `start`：顶部对齐
   * * `center`：居中对齐
   * * `end`：底部对齐
   */
  @property({ reflect: true })
  public alignment: 'start' | 'center' | 'end' = 'start';

  /**
   * 默认导航栏相对于 body 元素显示，该参数设置为 true 时，导航栏将相对于它的父元素显示
   *
   * Note:
   * 设置了该属性时，必须手动在父元素上设置样式 `position: relative; box-sizing: border-box;`
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public contained = false;

  /**
   * 是否在导航栏和页面内容之间添加分割线
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public divider = false;

  @watch('activeKey')
  private onActiveKeyChange() {
    // 根据 activeKey 读取对应 navigation-rail-item 的值
    this.value =
      this.items.find((item) => item.key === this.activeKey)?.value ?? '';

    emit(this, 'change');
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

  @watch('placement')
  private onPlacementChange() {
    this.items.forEach((item) => {
      item.placement = this.placement;
    });

    const isPlacementRight = this.placement === 'right';
    const width = $(this).innerWidth();

    $(this.parentTarget).css({
      'padding-left': isPlacementRight ? 0 : width,
      'padding-right': isPlacementRight ? width : 0,
    });
  }

  private onClick(event: MouseEvent): void {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest(
      'mdui-navigation-rail-item',
    ) as NavigationRailItem;

    this.activeKey = item.key;
    this.updateActive();
  }

  private updateActive() {
    this.items.forEach((item) => (item.active = this.activeKey === item.key));
  }

  protected onSlotChange() {
    this.items.forEach((item) => {
      item.placement = this.placement;
    });
  }

  protected override render() {
    const hasTopSlot = this.hasSlotController.test('top');
    const hasBottomSlot = this.hasSlotController.test('bottom');

    return html`${when(
        hasTopSlot,
        () =>
          html`<span part="top" class="top">
            <slot name="top"></slot>
          </span>`,
      )}
      <span class="top-spacer"></span>
      <span part="items" class="items">
        <slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>
      </span>
      <span class="bottom-spacer"></span>
      ${when(
        hasBottomSlot,
        () => html`<span part="bottom" class="bottom">
          <slot name="bottom"></slot>
        </span>`,
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-rail': NavigationRail;
  }
}
