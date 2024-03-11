import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/add.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/parent.js';
import '@mdui/jq/methods/parents.js';
import { isString, isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { arraysEqualIgnoreOrder } from '@mdui/shared/helpers/array.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { delay } from '@mdui/shared/helpers/delay.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { menuStyle } from './menu-style.js';
import type { MenuItem as MenuItemOriginal } from './menu-item.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

type MenuItem = MenuItemOriginal & {
  dense: boolean;
  selects: undefined | 'single' | 'multiple';
  submenuTrigger: string;
  submenuOpenDelay: number;
  submenuCloseDelay: number;
  selected: boolean;
  focusable: boolean;
  readonly key: number;
};

/**
 * 键盘快捷键：
 * * `Arrow Up` / `Arrow Down` - 使焦点在 `<mdui-menu-item>` 之间向上/向下切换
 * * `Home` / `End` - 使焦点跳转到第一个/最后一个 `<mdui-menu-item>` 元素上
 * * `Space` - 可选中时，选中/取消选中一项
 * * `Enter` - 包含子菜单时，打开子菜单；为链接时，跳转链接
 * * `Escape` - 子菜单已打开时，关闭子菜单
 *
 * @summary 菜单组件。需配合 `<mdui-menu-item>` 组件使用
 *
 * ```html
 * <mdui-menu>
 * ..<mdui-menu-item>Item 1</mdui-menu-item>
 * ..<mdui-menu-item>Item 2</mdui-menu-item>
 * </mdui-menu>
 * ```
 *
 * @event change - 菜单项选中状态变化时触发
 *
 * @slot - 子菜单项（`<mdui-menu-item>`）、分割线（[`<mdui-divider>`](/docs/2/components/divider)）等元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-menu')
export class Menu extends MduiElement<MenuEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, menuStyle];

  /**
   * 菜单项的可选状态。默认不可选。可选值包括：
   *
   * * `single`：单选
   * * `multiple`：多选
   */
  @property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
  public selects?:
    | /*单选*/ 'single'
    | /*多选*/ 'multiple' ;

  /**
   * 当前选中的 `<mdui-menu-item>` 的值。
   *
   * **Note**：该属性的 HTML 属性始终为字符串，仅在 `selects="single"` 时可通过 HTML 属性设置初始值；该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。因此，在 `selects="multiple"` 时，若要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property()
  public value?: string | string[];

  /**
   * 菜单项是否使用紧凑布局
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public dense = false;

  /**
   * 子菜单的触发方式，支持多个值，用空格分隔。可选值包括：
   *
   * * `click`：点击菜单项时打开子菜单
   * * `hover`：鼠标悬浮到菜单项上时打开子菜单
   * * `focus`：聚焦到菜单项上时打开子菜单
   * * `manual`：仅能通过编程方式打开和关闭子菜单，不能再指定其他触发方式
   */
  @property({ reflect: true, attribute: 'submenu-trigger' })
  public submenuTrigger:
    | /*点击菜单项时打开子菜单*/ 'click'
    | /*鼠标悬浮到菜单项上时打开子菜单*/ 'hover'
    | /*聚焦到菜单项上时打开子菜单*/ 'focus'
    | /*仅能通过编程方式打开和关闭子菜单，不能再指定其他触发方式*/ 'manual'
    | string = 'click hover';

  /**
   * 鼠标悬浮触发子菜单打开的延时，单位毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'submenu-open-delay' })
  public submenuOpenDelay = 200;

  /**
   * 鼠标悬浮触发子菜单关闭的延时，单位毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'submenu-close-delay' })
  public submenuCloseDelay = 200;

  // 因为 menu-item 的 value 可能会重复，所有在每一个 menu-item 元素上都加了一个唯一的 key 属性，通过 selectedKeys 来记录选中状态的 key
  @state()
  private selectedKeys: number[] = [];

  // 直接子元素（不包含子菜单中的菜单项）
  @queryAssignedElements({ flatten: true, selector: 'mdui-menu-item' })
  private readonly childrenItems!: MenuItem[];

  // 是否是初始状态，初始状态不触发 change 事件
  private isInitial = true;

  // 最后一次获得焦点的 menu-item 元素。为嵌套菜单时，把不同层级的 menu-item 放到对应索引位的位置
  private lastActiveItems: MenuItem[] = [];

  private readonly definedController = new DefinedController(this, {
    relatedElements: ['mdui-menu-item'],
  });

  // 菜单项元素（包含子菜单中的菜单项）
  private get items(): MenuItem[] {
    return $(this.childrenItems)
      .find('mdui-menu-item')
      .add(this.childrenItems)
      .get();
  }

  // 菜单项元素（不包含已禁用的，包含子菜单中的菜单项）
  private get itemsEnabled(): MenuItem[] {
    return this.items.filter((item) => !item.disabled);
  }

  // 当前菜单是否为单选
  private get isSingle() {
    return this.selects === 'single';
  }

  // 当前菜单是否为多选
  private get isMultiple() {
    return this.selects === 'multiple';
  }

  // 当前菜单是否可选择
  private get isSelectable() {
    return this.isSingle || this.isMultiple;
  }

  // 当前菜单是否为子菜单
  private get isSubmenu() {
    return !$(this).parent().length;
  }

  // 最深层级的子菜单中，最后交互过的 menu-item
  private get lastActiveItem() {
    const index = this.lastActiveItems.length
      ? this.lastActiveItems.length - 1
      : 0;
    return this.lastActiveItems[index];
  }
  private set lastActiveItem(item: MenuItem) {
    const index = this.lastActiveItems.length
      ? this.lastActiveItems.length - 1
      : 0;
    this.lastActiveItems[index] = item;
  }

  @watch('dense')
  @watch('selects')
  @watch('submenuTrigger')
  @watch('submenuOpenDelay')
  @watch('submenuCloseDelay')
  private async onSlotChange() {
    await this.definedController.whenDefined();

    this.items.forEach((item) => {
      item.dense = this.dense;
      item.selects = this.selects;
      item.submenuTrigger = this.submenuTrigger;
      item.submenuOpenDelay = this.submenuOpenDelay;
      item.submenuCloseDelay = this.submenuCloseDelay;
    });
  }

  @watch('selects', true)
  private async onSelectsChange() {
    if (!this.isSelectable) {
      // 不可选中，清空选中值
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      // 单选，只保留第一个选中的值
      this.setSelectedKeys(this.selectedKeys.slice(0, 1));
    }

    await this.onSelectedKeysChange();
  }

  @watch('selectedKeys', true)
  private async onSelectedKeysChange() {
    await this.definedController.whenDefined();

    // 根据 selectedKeys 读取出对应 menu-item 的 value
    const values = this.itemsEnabled
      .filter((item) => this.selectedKeys.includes(item.key))
      .map((item) => item.value!);
    const value = this.isMultiple ? values : values[0] || undefined;

    this.setValue(value);

    if (!this.isInitial) {
      this.emit('change');
    }
  }

  @watch('value')
  private async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();

    // 根据 value 找出对应的 menu-item，并把这些 menu-item 的 key 赋值给 selectedKeys
    if (!this.isSelectable) {
      this.updateSelected();
      return;
    }

    const values = (
      this.isSingle
        ? [this.value as string | undefined]
        : // 多选时，传入的值可能是字符串（通过 attribute 属性设置）；或字符串数组（通过 property 属性设置）
          isString(this.value)
          ? [this.value as string]
          : (this.value as string[])
    ).filter((i) => i);

    if (!values.length) {
      this.setSelectedKeys([]);
    } else if (this.isSingle) {
      const firstItem = this.itemsEnabled.find(
        (item) => item.value === values[0],
      );
      this.setSelectedKeys(firstItem ? [firstItem.key] : []);
    } else if (this.isMultiple) {
      this.setSelectedKeys(
        this.itemsEnabled
          .filter((item) => values.includes(item.value))
          .map((item) => item.key),
      );
    }

    this.updateSelected();
    this.updateFocusable();
  }

  /**
   * 将焦点设置在当前元素上
   */
  public focus(options?: FocusOptions): void {
    if (this.lastActiveItem) {
      this.focusOne(this.lastActiveItem, options);
    }
  }

  /**
   * 从当前元素中移除焦点
   */
  public blur(): void {
    if (this.lastActiveItem) {
      this.lastActiveItem.blur();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.definedController.whenDefined().then(() => {
      this.updateFocusable();
      this.lastActiveItem = this.items.find((item) => item.focusable)!;
    });

    // 子菜单打开时，把焦点放到新的子菜单上
    this.addEventListener('submenu-open', (e) => {
      const $parentItem = $(e.target as MenuItem);
      const submenuItemsEnabled = $parentItem
        .children('mdui-menu-item:not([disabled])')
        .get() as MenuItem[];
      const submenuLevel = $parentItem.parents('mdui-menu-item').length + 1; // 打开的是第几级子菜单

      if (submenuItemsEnabled.length) {
        this.lastActiveItems[submenuLevel] = submenuItemsEnabled[0];
        this.updateFocusable();
        this.focusOne(this.lastActiveItems[submenuLevel]);
      }
    });

    // 子菜单关闭时，把焦点还原到父菜单上
    this.addEventListener('submenu-close', (e) => {
      const $parentItem = $(e.target as MenuItem);
      const submenuLevel = $parentItem.parents('mdui-menu-item').length + 1; // 打开的是第几级子菜单

      if (this.lastActiveItems.length - 1 === submenuLevel) {
        this.lastActiveItems.pop();
        this.updateFocusable();
        if (this.lastActiveItems[submenuLevel - 1]) {
          this.focusOne(this.lastActiveItems[submenuLevel - 1]);
        }
      }
    });
  }

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
      @keydown=${this.onKeyDown}
    ></slot>`;
  }

  private setSelectedKeys(selectedKeys: number[]): void {
    if (!arraysEqualIgnoreOrder(this.selectedKeys, selectedKeys)) {
      this.selectedKeys = selectedKeys;
    }
  }

  private setValue(value: string | string[] | undefined): void {
    if (this.isSingle || isUndefined(this.value) || isUndefined(value)) {
      this.value = value;
    } else if (
      !arraysEqualIgnoreOrder(this.value as string[], value as string[])
    ) {
      this.value = value;
    }
  }

  // 获取和指定菜单项同级的所有菜单项
  private getSiblingsItems(item: MenuItem, onlyEnabled = false): MenuItem[] {
    return $(item)
      .parent()
      .children(`mdui-menu-item${onlyEnabled ? ':not([disabled])' : ''}`)
      .get();
  }

  // 更新 menu-item 的可聚焦状态
  private updateFocusable() {
    // 焦点优先放在之前焦点所在的元素上
    if (this.lastActiveItem) {
      this.items.forEach((item) => {
        item.focusable = item.key === this.lastActiveItem.key;
      });
      return;
    }

    // 没有选中任何一项，焦点放在第一个 menu-item 上
    if (!this.selectedKeys.length) {
      this.itemsEnabled.forEach((item, index) => {
        item.focusable = !index;
      });
      return;
    }

    // 如果是单选，焦点放在当前选中的元素上
    if (this.isSingle) {
      this.items.forEach((item) => {
        item.focusable = this.selectedKeys.includes(item.key);
      });
      return;
    }

    // 是多选，且原焦点不在 selectedKeys 上，焦点放在第一个选中的 menu-item 上
    if (this.isMultiple) {
      const focusableItem = this.items.find((item) => item.focusable);
      if (
        !focusableItem?.key ||
        !this.selectedKeys.includes(focusableItem.key)
      ) {
        this.itemsEnabled
          .filter((item) => this.selectedKeys.includes(item.key))
          .forEach((item, index) => (item.focusable = !index));
      }
    }
  }

  private updateSelected() {
    // 选中 menu-item
    this.items.forEach((item) => {
      item.selected = this.selectedKeys.includes(item.key);
    });
  }

  // 切换一个菜单项的选中状态
  private selectOne(item: MenuItem) {
    if (this.isMultiple) {
      // 直接修改 this.selectedKeys 无法被 watch 监听到，需要先克隆一份 this.selectedKeys
      const selectedKeys = [...this.selectedKeys];
      if (selectedKeys.includes(item.key)) {
        selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
      } else {
        selectedKeys.push(item.key);
      }
      this.setSelectedKeys(selectedKeys);
    }

    if (this.isSingle) {
      if (this.selectedKeys.includes(item.key)) {
        this.setSelectedKeys([]);
      } else {
        this.setSelectedKeys([item.key]);
      }
    }

    this.isInitial = false;
    this.updateSelected();
  }

  // 使一个 menu-item 可聚焦
  private async focusableOne(item: MenuItem) {
    this.items.forEach((_item) => (_item.focusable = _item.key === item.key));
    await delay(); // 等待 focusableMixin 更新完成
  }

  // 聚焦一个 menu-item
  private focusOne(item: MenuItem, options?: FocusOptions) {
    item.focus(options);
  }

  private async onClick(event: MouseEvent) {
    if (!this.definedController.isDefined()) {
      return;
    }

    if (this.isSubmenu) {
      return;
    }

    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest('mdui-menu-item') as MenuItem | null;

    if (!item || item.disabled) {
      return;
    }

    this.lastActiveItem = item;

    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }

    await this.focusableOne(item);
    this.focusOne(item);
  }

  private async onKeyDown(event: KeyboardEvent) {
    if (!this.definedController.isDefined()) {
      return;
    }

    if (this.isSubmenu) {
      return;
    }

    const item = event.target as MenuItem;

    // 按回车键，触发点击
    if (event.key === 'Enter') {
      event.preventDefault();
      item.click();
    }

    // 按下空格键时，阻止页面向下滚动，切换选中状态
    if (event.key === ' ') {
      event.preventDefault();

      if (this.isSelectable && item.value) {
        this.selectOne(item);
        await this.focusableOne(item);
        this.focusOne(item);
      }
    }

    // 按下方向键时，上下移动焦点；只在和当前 item 同级的 item 直接切换
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      const items = this.getSiblingsItems(item, true);
      const activeItem = items.find((item) => item.focusable);
      let index = activeItem ? items.indexOf(activeItem) : 0;

      if (items.length > 0) {
        event.preventDefault();

        if (event.key === 'ArrowDown') {
          index++;
        } else if (event.key === 'ArrowUp') {
          index--;
        } else if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = items.length - 1;
        }

        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }

        this.lastActiveItem = items[index];
        await this.focusableOne(items[index]);
        this.focusOne(items[index]);
        return;
      }
    }
  }
}

export interface MenuEventMap {
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu': Menu;
  }
}
