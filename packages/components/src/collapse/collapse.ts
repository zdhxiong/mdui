import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/is.js';
import { isElement } from '@mdui/jq/shared/helper.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { collapseStyle } from './collapse-style.js';
import type { CollapseItem as CollapseItemOriginal } from './collapse-item.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type CollapseItem = CollapseItemOriginal & {
  active: boolean;
  readonly key: number;
};

/**
 * @event change - 当前打开的折叠面板项改变时触发
 *
 * @slot - `<mdui-collapse-item>` 组件
 */
@customElement('mdui-collapse')
export class Collapse extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    collapseStyle,
  ];

  /**
   * 是否为手风琴模式
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public accordion = false;

  /**
   * 当前打开的 `<mdui-collapse-item>` 的值
   *
   * Note:
   * 该属性的 HTML 属性始终为字符串，且仅在 `accordion` 为 `true` 时可以设置初始值；
   * 该属性的 JavaScript 属性值在 `accordion` 为 `true` 时为字符串、在 `accordion` 为 `false` 时为字符串数组。
   * 所以，在 `accordion` 为 `false` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property()
  public value: string | string[] = [];

  /**
   * 是否禁用该折叠面板
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public disabled = false;

  // 因为 collapse-item 的 value 可能会重复，所以在每个 collapse-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKeys: number[] = [];

  private items: CollapseItem[] = [];

  @watch('activeKeys', true)
  private onActiveKeysChange() {
    // 根据 activeKeys 读取对应 collapse-item 的值
    this.value = this.accordion
      ? this.items.find((item) => this.activeKeys.includes(item.key))?.value ??
        ''
      : this.items
          .filter((item) => this.activeKeys.includes(item.key))
          .map((item) => item.value);

    emit(this, 'change');
  }

  @watch('value')
  private onValueChange() {
    if (this.accordion) {
      const value = this.value as string;
      if (!value) {
        this.activeKeys = [];
      } else {
        const item = this.items.find((item) => item.value === value);
        this.activeKeys = item ? [item.key] : [];
      }
    } else {
      const value = this.value as string[];
      if (!value.length) {
        this.activeKeys = [];
      } else {
        this.activeKeys = this.items
          .filter((item) => value.includes(item.value))
          .map((item) => item.key);
      }
    }

    this.updateActive();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.syncItems();
  }

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
    ></slot>`;
  }

  private syncItems() {
    this.items = $(this)
      .find('mdui-collapse-item')
      .get() as unknown as CollapseItem[];
  }

  private onClick(event: MouseEvent) {
    // 全部禁用
    if (this.disabled) {
      return;
    }

    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
    if (event.button) {
      return;
    }

    // collapse-item 被禁用，忽略
    const target = event.target as HTMLElement;
    const item = target.closest('mdui-collapse-item') as CollapseItem;
    if (item.disabled) {
      return;
    }

    const path = event.composedPath() as HTMLElement[];

    // 指定了 trigger 时，点击了其他地方时，忽略
    if (
      item.trigger &&
      !path.find((element) => isElement(element) && $(element).is(item.trigger))
    ) {
      return;
    }

    // header 元素，忽略点击 header 以外的元素
    if (
      !path.find(
        (element) => isElement(element) && element.part.contains('header'),
      )
    ) {
      return;
    }

    if (this.accordion) {
      if (this.activeKeys.includes(item.key)) {
        this.activeKeys = [];
      } else {
        this.activeKeys = [item.key];
      }
    } else {
      // 直接修改 this.activeKeys 无法被 watch 监听到，需要先克隆一份 this.activeKeys
      const activeKeys = [...this.activeKeys];
      if (activeKeys.includes(item.key)) {
        activeKeys.splice(activeKeys.indexOf(item.key), 1);
      } else {
        activeKeys.push(item.key);
      }
      this.activeKeys = activeKeys;
    }

    this.updateActive();
  }

  private onSlotChange() {
    this.syncItems();
    this.updateActive();
  }

  private updateActive() {
    this.items.forEach(
      (item) => (item.active = this.activeKeys.includes(item.key)),
    );
  }
}
