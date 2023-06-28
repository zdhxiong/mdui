import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/innerWidth.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { navigationRailStyle } from './navigation-rail-style.js';
import type { NavigationRailItem as NavigationRailItemOriginal } from './navigation-rail-item.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

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
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-navigation-rail')
export class NavigationRail extends LayoutItemBase {
  public static override styles: CSSResultGroup = [
    componentStyle,
    navigationRailStyle,
  ];

  /**
   * 当前选中的 `<mdui-navigation-rail-item>` 的值
   */
  @property({ reflect: true })
  public value?: string;

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
   * 默认导航栏相对于 `body` 元素显示，该参数设置为 `true` 时，导航栏将相对于它的父元素显示
   *
   * Note:
   * 设置了该属性时，必须手动在父元素上设置样式 `position: relative;`
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public contained = false;

  /**
   * 是否在导航栏和页面内容之间添加分割线
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public divider = false;

  // 因为 navigation-rail-item 的 value 可能会重复，所以在每个 navigation-rail-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKey = 0;

  private readonly hasSlotController = new HasSlotController(
    this,
    'top',
    'bottom',
  );

  // 是否已完成初始 value 的设置。首次设置初始值时，不触发 change 事件
  private hasSetDefaultValue = false;

  protected override get layoutPlacement(): LayoutPlacement {
    return this.placement;
  }

  // 所有的子项元素
  private get items() {
    return $(this)
      .find('mdui-navigation-rail-item')
      .get() as unknown as NavigationRailItem[];
  }

  private get parentTarget() {
    return this.contained || this.isParentLayout
      ? this.parentElement!
      : document.body;
  }

  private get isRight() {
    return this.placement === 'right';
  }

  private get paddingValue(): number | undefined {
    return ['fixed', 'absolute'].includes($(this).css('position'))
      ? this.offsetWidth
      : undefined;
  }

  @watch('activeKey')
  private onActiveKeyChange() {
    // 根据 activeKey 读取对应 navigation-rail-item 的值
    const item = this.items.find((item) => item.key === this.activeKey);
    this.value = item?.value;

    if (this.hasSetDefaultValue) {
      emit(this, 'change');
    } else {
      this.hasSetDefaultValue = true;
    }
  }

  @watch('value')
  private onValueChange() {
    const item = this.items.find((item) => item.value === this.value);
    this.activeKey = item?.key ?? 0;

    this.updateActive();
  }

  // 首次渲染在 @watch('placement') 中已经执行，这里跳过
  @watch('contained', true)
  private onContainedChange() {
    if (this.isParentLayout) {
      return;
    }

    $(document.body).css({
      paddingLeft: this.contained || this.isRight ? null : this.paddingValue,
      paddingRight: this.contained || !this.isRight ? null : this.paddingValue,
    });
    $(this.parentElement!).css({
      paddingLeft: this.contained && !this.isRight ? this.paddingValue : null,
      paddingRight: this.contained && this.isRight ? this.paddingValue : null,
    });
  }

  @watch('placement')
  private onPlacementChange() {
    this.layoutManager?.updateLayout(this);

    this.items.forEach((item) => {
      item.placement = this.placement;
    });

    if (this.isParentLayout) {
      return;
    }

    $(this.parentTarget).css({
      paddingLeft: this.isRight ? null : this.paddingValue,
      paddingRight: this.isRight ? this.paddingValue : null,
    });
  }

  public override connectedCallback() {
    super.connectedCallback();

    if (!this.isParentLayout) {
      $(this.parentTarget).css({
        paddingLeft: this.isRight ? null : this.paddingValue,
        paddingRight: this.isRight ? this.paddingValue : null,
      });
    }
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();

    if (!this.isParentLayout) {
      $(this.parentTarget).css({
        paddingLeft: this.isRight ? undefined : null,
        paddingRight: this.isRight ? null : undefined,
      });
    }
  }

  protected override render(): TemplateResult {
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

  private onSlotChange() {
    this.items.forEach((item) => {
      item.placement = this.placement;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-rail': NavigationRail;
  }
}
