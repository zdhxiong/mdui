import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/is.js';
import { isElement, isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { arraysEqualIgnoreOrder } from '@mdui/shared/helpers/array.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { collapseStyle } from './collapse-style.js';
import type { CollapseItem as CollapseItemOriginal } from './collapse-item.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type CollapseItem = CollapseItemOriginal & {
  active: boolean;
  isInitial: boolean;
  readonly key: number;
};

/**
 * @summary 折叠面板组件。需与 `<mdui-collapse-item>` 组件配合使用
 *
 * ```html
 * <mdui-collapse>
 * ..<mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
 * ..<mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
 * </mdui-collapse>
 * ```
 *
 * @event change - 当前打开的折叠面板项改变时触发
 *
 * @slot - `<mdui-collapse-item>` 组件
 */
@customElement('mdui-collapse')
export class Collapse extends MduiElement<CollapseEventMap> {
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
    converter: booleanConverter,
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
  public value?: string | string[];

  /**
   * 是否禁用该折叠面板
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  // 因为 collapse-item 的 value 可能会重复，所以在每个 collapse-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
  @state()
  private activeKeys: number[] = [];

  // 子元素 <mdui-collapse-item> 的集合
  @queryAssignedElements({ selector: 'mdui-collapse-item', flatten: true })
  private readonly items!: CollapseItem[];

  // 是否是初始状态，初始状态不触发 change 事件，没有动画
  private isInitial = true;

  private definedController = new DefinedController(this, {
    relatedElements: ['mdui-collapse-item'],
  });

  @watch('activeKeys', true)
  private async onActiveKeysChange() {
    await this.definedController.whenDefined();

    // 根据 activeKeys 读取对应 collapse-item 的值
    const value = this.accordion
      ? this.items.find((item) => this.activeKeys.includes(item.key))?.value
      : this.items
          .filter((item) => this.activeKeys.includes(item.key))
          .map((item) => item.value!);
    this.setValue(value);

    if (!this.isInitial) {
      this.emit('change');
    }
  }

  @watch('value')
  private async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();

    if (this.accordion) {
      const value = this.value as string | undefined;
      if (!value) {
        this.setActiveKeys([]);
      } else {
        const item = this.items.find((item) => item.value === value);
        this.setActiveKeys(item ? [item.key] : []);
      }
    } else {
      const value = this.value as string[];
      if (!value.length) {
        this.setActiveKeys([]);
      } else {
        const activeKeys = this.items
          .filter((item) => value.includes(item.value!))
          .map((item) => item.key);
        this.setActiveKeys(activeKeys);
      }
    }

    this.updateItems();
  }

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
    ></slot>`;
  }

  private setActiveKeys(activeKeys: number[]): void {
    if (!arraysEqualIgnoreOrder(this.activeKeys, activeKeys)) {
      this.activeKeys = activeKeys;
    }
  }

  private setValue(value: string | string[] | undefined): void {
    if (this.accordion || isUndefined(this.value) || isUndefined(value)) {
      this.value = value;
    } else if (
      !arraysEqualIgnoreOrder(this.value as string[], value as string[])
    ) {
      this.value = value;
    }
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

    const target = event.target as HTMLElement;
    const item = target.closest('mdui-collapse-item') as CollapseItem | null;

    // collapse-item 被禁用，忽略
    if (!item || item.disabled) {
      return;
    }

    const path = event.composedPath() as HTMLElement[];

    // 指定了 trigger 时，点击了其他地方时，忽略
    if (
      item.trigger &&
      !path.find(
        (element) => isElement(element) && $(element).is(item.trigger!),
      )
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
        this.setActiveKeys([]);
      } else {
        this.setActiveKeys([item.key]);
      }
    } else {
      // 直接修改 this.activeKeys 无法被 watch 监听到，需要先克隆一份 this.activeKeys
      const activeKeys = [...this.activeKeys];
      if (activeKeys.includes(item.key)) {
        activeKeys.splice(activeKeys.indexOf(item.key), 1);
      } else {
        activeKeys.push(item.key);
      }
      this.setActiveKeys(activeKeys);
    }

    this.isInitial = false;

    this.updateItems();
  }

  private async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }

  // 更新 <mdui-collapse-item> 的状态
  private updateItems() {
    this.items.forEach((item) => {
      item.active = this.activeKeys.includes(item.key);
      item.isInitial = this.isInitial;
    });
  }
}

export interface CollapseEventMap {
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-collapse': Collapse;
  }
}
