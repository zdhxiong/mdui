import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tabsStyle } from './tabs-style.js';
import type { TabPanel as TabPanelOriginal } from './tab-panel.js';
import type { Tab as TabOriginal } from './tab.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
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
 * @summary 选项卡组件。需配合 `<mdui-tab>` 和 `<mdui-tab-panel>` 组件使用
 *
 * ```html
 * <mdui-tabs value="tab-1">
 * ..<mdui-tab value="tab-1">Tab 1</mdui-tab>
 * ..<mdui-tab value="tab-2">Tab 2</mdui-tab>
 * ..<mdui-tab value="tab-3">Tab 3</mdui-tab>
 *
 * ..<mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
 * </mdui-tabs>
 * ```
 *
 * @event change - 选中的值变化时触发
 *
 * @slot - `<mdui-tab>` 元素
 * @slot panel - `<mdui-tab-panel>` 元素
 *
 * @csspart container - `<mdui-tab>` 元素的容器
 * @csspart indicator - 激活状态指示器
 */
@customElement('mdui-tabs')
export class Tabs extends MduiElement<TabsEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, tabsStyle];

  /**
   * 选项卡形状。可选值包括：
   *
   * * `primary`：适用于位于 `<mdui-top-app-bar>` 下方，用于切换应用的主页面的场景
   * * `secondary`：适用于位于页面中，用于切换一组相关内容的场景
   */
  @property({ reflect: true })
  public variant:
    | /*适用于位于 `<mdui-top-app-bar>` 下方，用于切换应用的主页面的场景*/ 'primary'
    | /*适用于位于页面中，用于切换一组相关内容的场景*/ 'secondary' = 'primary';

  /**
   * 当前激活的 `<mdui-tab>` 的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 选项卡位置。默认为 `top-start`。可选值包括：
   *
   * * `top-start`：位于上方，左对齐
   * * `top`：位于上方，居中对齐
   * * `top-end`：位于上方，右对齐
   * * `bottom-start`：位于下方，左对齐
   * * `bottom`：位于下方，居中对齐
   * * `bottom-end`：位于下方，右对齐
   * * `left-start`：位于左侧，顶部对齐
   * * `left`：位于左侧，居中对齐
   * * `left-end`：位于左侧，底部对齐
   * * `right-start`：位于右侧，顶部对齐
   * * `right`：位于右侧，居中对齐
   * * `right-end`：位于右侧，底部对齐
   */
  @property({ reflect: true })
  public placement:
    | /*位于上方，左对齐*/ 'top-start'
    | /*位于上方，居中对齐*/ 'top'
    | /*位于上方，右对齐*/ 'top-end'
    | /*位于下方，左对齐*/ 'bottom-start'
    | /*位于下方，居中对齐*/ 'bottom'
    | /*位于下方，右对齐*/ 'bottom-end'
    | /*位于左侧，顶部对齐*/ 'left-start'
    | /*位于左侧，居中对齐*/ 'left'
    | /*位于左侧，底部对齐*/ 'left-end'
    | /*位于右侧，顶部对齐*/ 'right-start'
    | /*位于右侧，居中对齐*/ 'right'
    | /*位于右侧，底部对齐*/ 'right-end' = 'top-start';

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'full-width',
  })
  public fullWidth = false;

  // 因为 tab 的 value 可能会重复，所以在每个 tab 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKey = 0;

  // 是否为初始状态，初始状态不触发 change 事件
  @state()
  private isInitial = true;

  @queryAssignedElements({ selector: 'mdui-tab', flatten: true })
  private readonly tabs!: Tab[];

  @queryAssignedElements({
    selector: 'mdui-tab-panel',
    slot: 'panel',
    flatten: true,
  })
  private readonly panels!: TabPanel[];

  private activeTab?: Tab;
  private observeResize?: ObserveResize;
  private readonly containerRef: Ref<HTMLElement> = createRef();
  private readonly indicatorRef: Ref<HTMLElement> = createRef();
  private readonly definedController = new DefinedController(this, {
    relatedElements: ['mdui-tab', 'mdui-tab-panel'],
  });

  @watch('activeKey', true)
  private async onActiveKeyChange() {
    await this.definedController.whenDefined();

    // 根据 activeKey 读取对应 tab 的值
    this.value = this.tabs.find((tab) => tab.key === this.activeKey)?.value;

    this.updateActive();

    if (!this.isInitial) {
      this.emit('change');
    }
  }

  @watch('value')
  private async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();

    const tab = this.tabs.find((tab) => tab.value === this.value);
    this.activeKey = tab?.key ?? 0;
  }

  @watch('variant', true)
  @watch('placement', true)
  @watch('fullWidth', true)
  private async onIndicatorChange() {
    await this.updateComplete;
    this.updateIndicator();
  }

  public override connectedCallback() {
    super.connectedCallback();

    this.updateComplete.then(() => {
      this.observeResize = observeResize(this.containerRef.value!, () =>
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
        ${ref(this.containerRef)}
        part="container"
        class="container ${classMap({ initial: this.isInitial })}"
      >
        <slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>
        <div ${ref(this.indicatorRef)} part="indicator" class="indicator"></div>
      </div>
      <slot name="panel" @slotchange=${this.onSlotChange}></slot>`;
  }

  private async onSlotChange() {
    await this.definedController.whenDefined();

    this.updateActive();
  }

  private async onClick(event: MouseEvent) {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
    if (event.button) {
      return;
    }

    await this.definedController.whenDefined();

    const target = event.target as HTMLElement;
    const tab = target.closest('mdui-tab') as Tab | null;

    if (!tab) {
      return;
    }

    this.activeKey = tab.key;
    this.isInitial = false;
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

  private updateIndicator() {
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
      const $customSlots = $activeTab.find(':scope > [slot="custom"]');
      const children = $customSlots.length
        ? $customSlots.get()
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

export interface TabsEventMap {
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tabs': Tabs;
  }
}
