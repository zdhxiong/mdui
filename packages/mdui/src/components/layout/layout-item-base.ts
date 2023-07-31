import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { getLayout } from './helper.js';
import type { LayoutManager, LayoutPlacement } from './helper.js';
import type { Layout } from './layout.js';

export class LayoutItemBase extends LitElement {
  /**
   * 该组件在 `<mdui-layout>` 中的布局顺序，按从小到大排序。默认为 `0`
   */
  @property({ type: Number, reflect: true })
  public order?: number;

  protected layoutManager?: LayoutManager;

  // 父元素是否是 `mdui-layout`
  protected isParentLayout = false;

  /**
   * 当前布局组件所处的位置，父类必须实现该 getter
   */
  protected get layoutPlacement(): LayoutPlacement {
    throw new Error('Must implement placement getter!');
  }

  // order 变更时，需要重新调整布局
  @watch('order', true)
  private onOrderChange() {
    this.layoutManager?.updateOrder();
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    const parentElement = this.parentElement! as Layout;
    this.isParentLayout = isNodeName(parentElement, 'mdui-layout');

    if (this.isParentLayout) {
      this.layoutManager = getLayout(parentElement);
      this.layoutManager.registerItem(this);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.layoutManager) {
      this.layoutManager.unregisterItem(this);
    }
  }
}
