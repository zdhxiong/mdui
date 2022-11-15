import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tabsStyle } from './tabs-style.js';
import type { TabPanel as TabPanelOriginal } from './tab-panel.js';
import type { Tab as TabOriginal } from './tab.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

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
 * @csspart nav - `<mdui-tab>` 元素的容器
 * @csspart indicator - 激活状态指示器
 */
@customElement('mdui-tabs')
export class Tabs extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, tabsStyle];

  @query('.nav', true) protected readonly nav?: HTMLElement;
  @query('.indicator', true) protected readonly indicator?: HTMLElement;

  private activeTab?: Tab;
  private resizeObserver!: ResizeObserver;
  private tabs: Tab[] = [];
  private panels: TabPanel[] = [];

  // 因为 tab 的 value 可能会重复，所以在每个 tab 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state() private activeKey = 0;

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
  public value = '';

  /**
   * 对齐方式。可选值为：
   * * `start`：左对齐
   * * `center`：居中对齐
   * * `end`：右对齐
   */
  @property({ reflect: true })
  public alignment: 'start' | 'center' | 'end' = 'start';

  /**
   * 选项卡位置。可选值为：
   * * `top`：选项卡位于上方
   * * `right`：选项卡位于右侧
   * * `bottom`：选项卡位于下方
   * * `left`：选项卡位于左侧
   */
  @property({ reflect: true })
  public placement: 'top' | 'right' | 'bottom' | 'left' = 'top';

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public fullwidth = false;

  async connectedCallback() {
    super.connectedCallback();
    this.syncTabsAndPanels();

    this.resizeObserver = new ResizeObserver(() => {
      this.updateIndicator();
    });

    await this.updateComplete;
    this.resizeObserver.observe(this.nav!);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this.nav!);
  }

  @watch('activeKey', true)
  private onActiveKeyChange() {
    // 根据 activeKey 读取对应 tab 的值
    this.value =
      this.tabs.find((tab) => tab.key === this.activeKey)?.value ?? '';

    emit(this, 'change');
  }

  @watch('value')
  private onValueChange() {
    if (!this.value) {
      this.activeKey = 0;
    } else {
      const tab = this.tabs.find((tab) => tab.value === this.value);
      this.activeKey = tab ? tab.key : 0;
    }

    this.updateActive();
  }

  @watch('variant', true)
  @watch('alignment', true)
  @watch('placement', true)
  @watch('fullwidth', true)
  private onIndicatorChange() {
    this.updateIndicator();
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
    const $indicator = $(this.indicator!);
    const isVertical = ['left', 'right'].includes(this.placement);

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

  protected override render(): TemplateResult {
    return html`<div part="nav" class="nav" no-scrollbar-beauty>
        <slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>
        <div part="indicator" class="indicator"></div>
      </div>
      <slot name="panel" @slotchange=${this.onSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tabs': Tabs;
  }
}
