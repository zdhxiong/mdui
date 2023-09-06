import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/get.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import type { LayoutItemBase } from './layout-item-base.js';
import type { LayoutMain } from './layout-main.js';
import type { Layout } from './layout.js';
import type { JQ } from '@mdui/jq/shared/core.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';

export type LayoutPlacement = 'top' | 'left' | 'right' | 'bottom';

interface LayoutItemState {
  /**
   * 当前 `<mdui-layout-item>` 元素
   */
  element: LayoutItemBase;

  /**
   * 注册元素时，无需传该参数
   * 更新布局时，若传入该参数，则直接使用该值，不再计算元素的宽度
   * 布局更新一次后自动重置为 `undefined`
   */
  width?: number;

  /**
   * 注册元素时，无需传该参数
   * 更新布局时，若传入该参数，则直接使用该值，不再计算元素的高度
   * 布局更新一次后自动重置为 `undefined`
   */
  height?: number;

  /**
   * 放置完当前元素后，剩余空间距离顶部的距离
   */
  top?: number;

  /**
   * 放置完当前元素后，剩余空间距离底部的距离
   */
  bottom?: number;

  /**
   * 放置完当前元素后，剩余空间距离左侧的距离
   */
  left?: number;

  /**
   * 放置完当前元素后，剩余空间距离右侧的距离
   */
  right?: number;

  /**
   * 用于监听尺寸变化的 observeResize 实例
   */
  observeResize?: ObserveResize;
}

export class LayoutManager {
  private $layout: JQ<Layout>;
  private $main?: JQ<LayoutMain>;
  private states: LayoutItemState[] = [];
  private items?: LayoutItemBase[];

  public constructor(element: Layout) {
    this.$layout = $(element);
  }

  /**
   * 注册 `<mdui-layout-main>`
   */
  public registerMain(element: LayoutMain): void {
    this.$main = $(element);
  }

  /**
   * 取消注册 `<mdui-layout-main>`
   */
  public unregisterMain(): void {
    this.$main = undefined;
  }

  /**
   * 注册新的 `<mdui-layout-item>`
   */
  public registerItem(element: LayoutItemBase): void {
    const state: LayoutItemState = { element };
    this.states.push(state);

    // 监听元素尺寸变化
    state.observeResize = observeResize(state.element, () => {
      // drawer 较特殊，在为模态化时，占据的宽度为 0
      if (
        isNodeName(state.element, 'mdui-navigation-drawer') &&
        // @ts-ignore
        state.element.isModal
      ) {
        this.updateLayout(state.element, { width: 0 });
      } else {
        this.updateLayout(state.element);
      }
    });

    this.items = undefined;
    this.resort();

    // 从头更新布局
    this.updateLayout();
  }

  /**
   * 取消注册 `<mdui-layout-item>`
   */
  public unregisterItem(element: LayoutItemBase): void {
    const index = this.states.findIndex((item) => item.element === element);
    if (index < 0) {
      return;
    }

    // 取消监听尺寸变化
    const item = this.states[index];
    item.observeResize?.unobserve();

    this.items = undefined;

    // 移除一个元素，并从下一个元素开始更新
    this.states.splice(index, 1);
    if (this.states[index]) {
      this.updateLayout(this.states[index].element);
    }
  }

  /**
   * 获取所有 `<mdui-layout-item>` 元素（按在 DOM 中的顺序）
   */
  public getItems(): LayoutItemBase[] {
    if (!this.items) {
      this.items = this.$layout
        .children(
          [
            'mdui-navigation-bar',
            'mdui-navigation-drawer',
            'mdui-navigation-rail',
            'mdui-bottom-app-bar',
            'mdui-top-app-bar',
            'mdui-layout-item',
          ].join(','),
        )
        .get() as unknown as LayoutItemBase[];
    }

    return this.items;
  }

  /**
   * 获取 `<mdui-layout-main>` 元素
   */
  public getMain(): LayoutMain | undefined {
    return this.$main ? this.$main[0] : undefined;
  }

  /**
   * 获取 `<mdui-layout-item>` 及 `<mdui-layout-main>` 元素
   */
  public getItemsAndMain(): (LayoutItemBase | LayoutMain)[] {
    return [...this.getItems(), this.getMain()!].filter((i) => i);
  }

  /**
   * 检查指定 `<mdui-layout-item>` 元素是否已注册
   */
  public hasItem(element: LayoutItemBase): boolean {
    return this.getItems().includes(element);
  }

  /**
   * 更新 `order` 值，更新完后重新计算布局
   */
  public updateOrder() {
    this.resort();
    this.updateLayout();
  }

  /**
   * 重新计算布局
   * @param element 从哪一个元素开始更新；若未传入参数，则将更新所有元素
   * @param size 此次更新中，元素的宽高（仅在此次更新中使用）。若不传则自动计算
   */
  public updateLayout(
    element?: LayoutItemBase,
    size?: { width?: number; height?: number },
  ): void {
    const state: LayoutItemState | undefined = element
      ? {
          element,
          width: size?.width,
          height: size?.height,
        }
      : undefined;

    const index = state
      ? this.states.findIndex((v) => v.element === state.element)
      : 0;

    if (index < 0) {
      return;
    }

    Object.assign(this.states[index], state);

    this.states.forEach((currState, currIndex) => {
      if (currIndex < index) {
        return;
      }

      // @ts-ignore
      const placement = currState.element.layoutPlacement;

      // 前一个元素
      const prevState = currIndex > 0 ? this.states[currIndex - 1] : undefined;
      const top = prevState?.top ?? 0;
      const right = prevState?.right ?? 0;
      const bottom = prevState?.bottom ?? 0;
      const left = prevState?.left ?? 0;

      Object.assign(currState, { top, right, bottom, left });

      switch (placement) {
        case 'top':
          currState.top! += currState.height ?? currState.element.offsetHeight;
          break;
        case 'right':
          currState.right! += currState.width ?? currState.element.offsetWidth;
          break;
        case 'bottom':
          currState.bottom! +=
            currState.height ?? currState.element.offsetHeight;
          break;
        case 'left':
          currState.left! += currState.width ?? currState.element.offsetWidth;
          break;
      }

      currState.height = currState.width = undefined;

      $(currState.element).css({
        position: 'absolute',
        top: placement === 'bottom' ? null : top,
        right: placement === 'left' ? null : right,
        bottom: placement === 'top' ? null : bottom,
        left: placement === 'right' ? null : left,
      });
    });

    // 更新完后，设置 layout-main 的 padding
    const lastState = this.states[this.states.length - 1];
    if (this.$main) {
      this.$main.css({
        paddingTop: lastState.top,
        paddingRight: lastState.right,
        paddingBottom: lastState.bottom,
        paddingLeft: lastState.left,
      });
    }
  }

  /**
   * 按 order 排序，order 相同时，按在 DOM 中的顺序排序
   */
  private resort() {
    const items = this.getItems();

    this.states.sort((a, b) => {
      const aOrder = a.element.order ?? 0;
      const bOrder = b.element.order ?? 0;

      if (aOrder > bOrder) {
        return 1;
      }
      if (aOrder < bOrder) {
        return -1;
      }
      if (items.indexOf(a.element) > items.indexOf(b.element)) {
        return 1;
      }
      if (items.indexOf(a.element) < items.indexOf(b.element)) {
        return -1;
      }
      return 0;
    });
  }
}

const layoutManagerMap: WeakMap<Layout, LayoutManager> = new WeakMap();

/**
 * 获取 layout 实例
 */
export const getLayout = (element: Layout): LayoutManager => {
  if (!layoutManagerMap.has(element)) {
    layoutManagerMap.set(element, new LayoutManager(element));
  }

  return layoutManagerMap.get(element)!;
};
