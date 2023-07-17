import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tabsStyle } from './tabs-style.js';
import type { TabPanel as TabPanelOriginal } from './tab-panel.js';
import type { Tab as TabOriginal } from './tab.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

type Tab = TabOriginal & {
  active: boolean;
  variant: 'primary' | 'secondary';
  readonly key: number;
};

type TabPanel = TabPanelOriginal & {
  active: boolean;
};

/**
 * @event click - 点击时触发
 * @event change - 选中的值变化时触发
 *
 * @slot - `<mdui-tab>` 元素
 * @slot panel - `<mdui-tab-panel>` 元素
 *
 * @csspart tab-container - `<mdui-tab>` 元素的容器
 * @csspart indicator - 激活状态指示器
 */
@customElement('mdui-tabs')
export class Tabs extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, tabsStyle];

  /**
   * 选项卡形状。可选值为：
   * * `primary`
   * * `secondary`
   */
  @property({ reflect: true })
  public variant: 'primary' | 'secondary' = 'primary';

  /**
   * 当前激活的 `<mdui-tab>` 的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 选项卡位置。可选值为：
   * * `top-start`：位于上方，且左对齐
   * * `top`：位于上方，且居中对齐
   * * `top-end`：位于上方，且右对齐
   * * `bottom-start`：位于下方，且左对齐
   * * `bottom`：位于下方，且居中对齐
   * * `bottom-end`：位于下方，且右对齐
   * * `left-start`：位于左侧，且顶部对齐
   * * `left`：位于左侧，且居中对齐
   * * `left-end`：位于左侧，且底部对齐
   * * `right-start`：位于右侧，且顶部对齐
   * * `right`：位于右侧，且居中对齐
   * * `right-end`：位于右侧，且底部对齐
   */
  @property({ reflect: true })
  public placement:
    | 'top-start' /*位于上方，且左对齐*/
    | 'top' /*位于上方，且居中对齐*/
    | 'top-end' /*位于上方，且右对齐*/
    | 'bottom-start' /*位于下方，且左对齐*/
    | 'bottom' /*位于下方，且居中对齐*/
    | 'bottom-end' /*位于下方，且右对齐*/
    | 'left-start' /*位于左侧，且顶部对齐*/
    | 'left' /*位于左侧，且居中对齐*/
    | 'left-end' /*位于左侧，且底部对齐*/
    | 'right-start' /*位于右侧，且顶部对齐*/
    | 'right' /*位于右侧，且居中对齐*/
    | 'right-end' /*位于右侧，且底部对齐*/ = 'top-start';

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public fullwidth = false;

  // 因为 tab 的 value 可能会重复，所以在每个 tab 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKey = 0;

  private activeTab?: Tab;
  private observeResize?: ObserveResize;
  private tabs: Tab[] = [];
  private panels: TabPanel[] = [];
  private readonly tabContainerRef: Ref<HTMLElement> = createRef();
  private readonly indicatorRef: Ref<HTMLElement> = createRef();

  @watch('activeKey', true)
  private onActiveKeyChange() {
    // 根据 activeKey 读取对应 tab 的值
    this.value = this.tabs.find((tab) => tab.key === this.activeKey)?.value;

    emit(this, 'change');
  }

  @watch('value')
  private onValueChange() {
    const tab = this.tabs.find((tab) => tab.value === this.value);
    this.activeKey = tab?.key ?? 0;

    this.updateActive();
  }

  @watch('variant', true)
  @watch('placement', true)
  @watch('fullwidth', true)
  private onIndicatorChange() {
    this.updateIndicator();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.syncTabsAndPanels();

    this.updateComplete.then(() => {
      this.observeResize = observeResize(this.tabContainerRef.value!, () =>
        this.updateIndicator(),
      );
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
  }

  protected override render(): TemplateResult {
    return html`<div
        ${ref(this.tabContainerRef)}
        part="tab-container"
        class="tab-container"
      >
        <slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>
        <div ${ref(this.indicatorRef)} part="indicator" class="indicator"></div>
      </div>
      <slot name="panel" @slotchange=${this.onSlotChange}></slot>`;
  }

  private syncTabsAndPanels() {
    this.tabs = $(this).find('mdui-tab').get() as unknown as Tab[];
    this.panels = $(this)
      .find('mdui-tab-panel[slot="panel"]')
      .get() as unknown as TabPanel[];
  }

  private onSlotChange() {
    this.syncTabsAndPanels();
    this.updateActive();
  }

  private onClick(event: MouseEvent): void {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const tab = target.closest('mdui-tab') as Tab;

    this.activeKey = tab.key;
    this.updateActive();
  }

  private updateActive() {
    this.activeTab = this.tabs
      .map((tab) => {
        tab.active = this.activeKey === tab.key;
        return tab;
      })
      .find((tab) => tab.active);

    this.panels.forEach(
      (panel) => (panel.active = panel.value === this.activeTab?.value),
    );

    this.updateIndicator();
  }

  private async updateIndicator() {
    await this.updateComplete;

    const activeTab = this.activeTab;
    const $indicator = $(this.indicatorRef.value!);
    const isVertical =
      this.placement.startsWith('left') || this.placement.startsWith('right');

    // 没有激活的，不显示指示器
    if (!activeTab) {
      $indicator.css({
        transform: isVertical ? 'scaleY(0)' : 'scaleX(0)',
      });
      return;
    }

    const $activeTab = $(activeTab);
    const offsetTop = activeTab.offsetTop;
    const offsetLeft = activeTab.offsetLeft;
    const commonStyle = isVertical
      ? { transform: 'scaleY(1)', width: '', left: '' }
      : { transform: 'scaleX(1)', height: '', top: '' };
    let shownStyle = {};

    if (this.variant === 'primary') {
      const customSlots = $activeTab.find(':scope > [slot="custom"]').get();
      const children = customSlots.length
        ? customSlots
        : $(activeTab.renderRoot as HTMLElement)
            .find('slot[name="custom"]')
            .children()
            .get();

      if (isVertical) {
        // 最上方的元素的顶部，距离容器顶部距离
        const top =
          Math.min(...children.map((child) => child.offsetTop)) + offsetTop;

        // 最下方的元素的底部，距离容器顶部的距离
        const bottom =
          Math.max(
            ...children.map((child) => child.offsetTop + child.offsetHeight),
          ) + offsetTop;

        shownStyle = { top, height: bottom - top };
      } else {
        // 最左侧的元素的左侧，距离容器左侧的距离
        const left =
          Math.min(...children.map((child) => child.offsetLeft)) + offsetLeft;

        // 最右侧的元素的右侧，距离容器左侧的距离
        const right =
          Math.max(
            ...children.map((child) => child.offsetLeft + child.offsetWidth),
          ) + offsetLeft;

        shownStyle = { left, width: right - left };
      }
    }

    if (this.variant === 'secondary') {
      shownStyle = isVertical
        ? { top: offsetTop, height: activeTab.offsetHeight }
        : { left: offsetLeft, width: activeTab.offsetWidth };
    }

    $indicator.css({ ...commonStyle, ...shownStyle });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tabs': Tabs;
  }
}
