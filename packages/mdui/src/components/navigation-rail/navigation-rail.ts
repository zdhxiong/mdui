import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { navigationRailStyle } from './navigation-rail-style.js';
import type { NavigationRailItem as NavigationRailItemOriginal } from './navigation-rail-item.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type NavigationRailItem = NavigationRailItemOriginal & {
  active: boolean;
  placement: 'left' | 'right';
  isInitial: boolean;
  readonly key: number;
};

/**
 * @summary 侧边导航栏组件。需与 `<mdui-navigation-rail-item>` 组件配合使用
 *
 * ```html
 * <mdui-navigation-rail>
 * ..<mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
 * </mdui-navigation-rail>
 * ```
 *
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
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS 的 `z-index` 值
 */
@customElement('mdui-navigation-rail')
export class NavigationRail extends LayoutItemBase<NavigationRailEventMap> {
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
   *
   * * `left`：显示在左侧
   * * `right`：显示在右侧
   */
  @property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
  public placement:
    | /*显示在左侧*/ 'left'
    | /*显示在右侧*/ 'right' = 'left';

  /**
   * 导航栏中的 `<mdui-navigation-rail-item>` 元素的对齐方式。可选值为：
   *
   * * `start`：顶部对齐
   * * `center`：居中对齐
   * * `end`：底部对齐
   */
  @property({ reflect: true })
  public alignment:
    | /*顶部对齐*/ 'start'
    | /*居中对齐*/ 'center'
    | /*底部对齐*/ 'end' = 'start';

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

  @queryAssignedElements({
    selector: 'mdui-navigation-rail-item',
    flatten: true,
  })
  private readonly items!: NavigationRailItem[];

  private readonly hasSlotController = new HasSlotController(
    this,
    'top',
    'bottom',
  );
  private readonly definedController = new DefinedController(this, {
    relatedElements: ['mdui-navigation-rail-item'],
  });

  // 是否是初始状态，初始状态不触发事件，不执行动画
  private isInitial = true;

  protected override get layoutPlacement(): LayoutPlacement {
    return this.placement;
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

  @watch('activeKey', true)
  private async onActiveKeyChange() {
    await this.definedController.whenDefined();

    // 根据 activeKey 读取对应 navigation-rail-item 的值
    const item = this.items.find((item) => item.key === this.activeKey);
    this.value = item?.value;

    if (!this.isInitial) {
      this.emit('change');
    }
  }

  @watch('value')
  private async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();

    const item = this.items.find((item) => item.value === this.value);
    this.activeKey = item?.key ?? 0;

    this.updateItems();
  }

  @watch('contained', true)
  private async onContainedChange() {
    if (this.isParentLayout) {
      return;
    }

    await this.definedController.whenDefined();

    $(document.body).css({
      paddingLeft: this.contained || this.isRight ? null : this.paddingValue,
      paddingRight: this.contained || !this.isRight ? null : this.paddingValue,
    });
    $(this.parentElement!).css({
      paddingLeft: this.contained && !this.isRight ? this.paddingValue : null,
      paddingRight: this.contained && this.isRight ? this.paddingValue : null,
    });
  }

  @watch('placement', true)
  private async onPlacementChange() {
    await this.definedController.whenDefined();

    this.layoutManager?.updateLayout(this);

    this.items.forEach((item) => {
      item.placement = this.placement;
    });

    if (!this.isParentLayout) {
      $(this.parentTarget).css({
        paddingLeft: this.isRight ? null : this.paddingValue,
        paddingRight: this.isRight ? this.paddingValue : null,
      });
    }
  }

  public override connectedCallback() {
    super.connectedCallback();

    if (!this.isParentLayout) {
      this.definedController.whenDefined().then(() => {
        $(this.parentTarget).css({
          paddingLeft: this.isRight ? null : this.paddingValue,
          paddingRight: this.isRight ? this.paddingValue : null,
        });
      });
    }
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();

    if (!this.isParentLayout && this.definedController.isDefined()) {
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
        () => html`<slot name="top" part="top" class="top"></slot>`,
      )}
      <span class="top-spacer"></span>
      <slot
        part="items"
        class="items"
        @slotchange=${this.onSlotChange}
        @click=${this.onClick}
      ></slot>
      <span class="bottom-spacer"></span>
      ${when(
        hasBottomSlot,
        () => html`<slot name="bottom" part="bottom" class="bottom"></slot>`,
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
    ) as NavigationRailItem | null;

    if (!item) {
      return;
    }

    this.activeKey = item.key;
    this.isInitial = false;

    this.updateItems();
  }

  private updateItems() {
    this.items.forEach((item) => {
      item.active = this.activeKey === item.key;
      item.placement = this.placement;
      item.isInitial = this.isInitial;
    });
  }

  private async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }
}

export interface NavigationRailEventMap {
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-rail': NavigationRail;
  }
}
