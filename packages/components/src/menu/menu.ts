import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { delay } from '@mdui/shared/helpers/delay.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/parent.js';
import '@mdui/jq/methods/parents.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/on.js';
import type { MenuItem as MenuItemOriginal } from './menu-item.js';
import { menuStyle } from './menu-style.js';

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
 * * `Arrow Up` / `Arrow Down` - 使焦点在 `mdui-menu-item` 之间向上/向下切换
 * * `Home` / `End` - 使焦点跳转到第一个/最后一个 `mdui-menu-item` 元素上
 * * `Space` - 可选中时，选中/取消选中一项
 * * `Enter` - 包含子菜单时，打开子菜单；为链接时，跳转链接
 * * `Escape` - 子菜单已打开时，关闭子菜单
 *
 * @event change - 菜单项的选中状态变化时触发
 *
 * @slot - 子菜单项（`<mdui-menu-item>`）、分割线（`<mdui-divider>`）等元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-menu')
export class Menu extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, menuStyle];

  // 菜单项元素（包含子菜单中的菜单项）
  protected get items() {
    return $(this).find('mdui-menu-item').get() as unknown as MenuItem[];
  }

  // 菜单项元素（不包含已禁用的，包含子菜单中的菜单项）
  protected get itemsEnabled() {
    return $(this)
      .find('mdui-menu-item:not([disabled])')
      .get() as unknown as MenuItem[];
  }

  // 当前菜单是否可选择
  protected get isSelectable() {
    return this.selects === 'single' || this.selects === 'multiple';
  }

  // 当前菜单是否为子菜单
  protected get isSubmenu() {
    return !$(this).parent().length;
  }

  // 最后一次获得焦点的 menu-item 数组，为嵌套菜单时，把不同层级的 menu-item 放到对应的数组位置
  protected lastActiveItems: MenuItem[] = [];

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

  // 因为 menu-item 的 value 可能会重复，所有在每一个 menu-item 元素上都加了一个唯一的 key 属性，通过 selectedKeys 来记录选中状态的 key
  @state() private selectedKeys: number[] = [];

  /**
   * 菜单项的可选中状态。默认为不可选中。可选值为：
   * * `single`：最多只能选中一个
   * * `multiple`：可以选中多个
   */
  @property({ reflect: true })
  public selects!:
    | undefined
    | 'single' /*菜单项为单选*/
    | 'multiple' /*菜单项为多选*/;

  /**
   * 当前选中的 `<mdui-menu-item>` 的值
   * 在 `selects="multiple"` 时，会将多个值使用“,”分隔（分隔符可通过 `value-separator` 属性修改）
   */
  @property()
  public value!: string;

  /**
   * 在 `selects="multiple"` 时，多个值之间使用该分隔符进行分隔
   */
  @property({ attribute: 'value-separator' })
  public valueSeparator = ',';

  /**
   * 菜单项是否使用更紧凑的布局
   */
  @property({ type: Boolean, reflect: true })
  public dense = false;

  /**
   * 子菜单的触发方式，支持传入多个值，用空格分隔。可选值为：
   * * `click`
   * * `hover`
   * * `focus`
   * * `manual`：使用了该值时，只能使用编程方式打开和关闭子菜单，且不能再指定其他触发方式
   */
  @property({ reflect: true, attribute: 'submenu-trigger' })
  public submenuTrigger:
    | 'click' /*鼠标点击触发*/
    | 'hover' /*鼠标悬浮触发*/
    | 'focus' /*聚焦时触发*/
    | 'manual' /*通过编程方式触发*/
    | 'click hover'
    | 'click focus'
    | 'hover focus'
    | 'click hover focus' = 'click hover';

  /**
   * 通过 hover 触发子菜单打开时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'submenu-open-delay' })
  public submenuOpenDelay = 200;

  /**
   * 通过 hover 触发子菜单关闭时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'submenu-close-delay' })
  public submenuCloseDelay = 200;

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.updateFocusable();
    this.lastActiveItem = this.items.find((item) => item.focusable)!;

    $(this).on({
      // 子菜单打开时，把焦点放到新的子菜单上
      'submenu-open': (e: CustomEvent) => {
        const $parentItem = $(e.target as MenuItem);
        const submenuItemsEnabled = $parentItem
          .children('mdui-menu-item:not([disabled])')
          .get() as MenuItem[];
        const submenuLevel = $parentItem.parents('mdui-menu-item').length + 1; // 打开的是几级子菜单
        if (submenuItemsEnabled.length) {
          this.lastActiveItems[submenuLevel] = submenuItemsEnabled[0];
          this.updateFocusable();
          this.focusOne(this.lastActiveItems[submenuLevel]);
        }
      },
      // 子菜单关闭时，把焦点还原到父菜单上
      'submenu-close': (e) => {
        const $parentItem = $(e.target as MenuItem);
        const submenuLevel = $parentItem.parents('mdui-menu-item').length + 1; // 打开的是几级子菜单
        if (this.lastActiveItems.length - 1 === submenuLevel) {
          this.lastActiveItems.pop();
          this.updateFocusable();
          if (this.lastActiveItems[submenuLevel - 1]) {
            this.focusOne(this.lastActiveItems[submenuLevel - 1]);
          }
        }
      },
    });
  }

  // 获取和指定菜单项同级的菜单项
  private getSiblingsItems(item: MenuItem, onlyEnabled = false): MenuItem[] {
    return $(item)
      .parent()
      .children(`mdui-menu-item${onlyEnabled ? ':not([disabled])' : ''}`)
      .get();
  }

  @watch('dense')
  @watch('selects')
  @watch('submenuTrigger')
  @watch('submenuOpenDelay')
  @watch('submenuCloseDelay')
  protected onSlotChange() {
    this.items.forEach((item) => {
      item.dense = this.dense;
      item.selects = this.selects;
      item.submenuTrigger = this.submenuTrigger;
      item.submenuOpenDelay = this.submenuOpenDelay;
      item.submenuCloseDelay = this.submenuCloseDelay;
    });
  }

  @watch('selects')
  private onSelectsChange() {
    if (!this.selects) {
      this.selectedKeys = [];
    }
  }

  @watch('selectedKeys')
  private onSelectedKeysChange() {
    // 根据 selectedKeys 读取出对应 menu-item 的 value
    this.value = this.items
      .filter((item) => this.selectedKeys.includes(item.key))
      .map((item) => item.value)
      .join(this.valueSeparator);

    emit(this, 'change');
  }

  @watch('value')
  private onValueChange() {
    // 根据 value 找出对应的 menu-item，并把这些 menu-item 的 key 赋值给 selectedKeys
    if (!this.isSelectable) {
      return;
    }

    const values = this.value.split(this.valueSeparator).filter((i) => i);

    if (!values.length) {
      this.selectedKeys = [];
    } else if (this.selects === 'single') {
      const firstItem = this.items.find((item) => item.value === values[0]);
      this.selectedKeys = firstItem ? [firstItem.key] : [];
    } else if (this.selects === 'multiple') {
      this.selectedKeys = this.items
        .filter((item) => values.includes(item.value))
        .map((item) => item.key);
    }

    this.updateSelected();
    this.updateFocusable();
  }

  // 更新 menu-item 的可聚焦状态
  private updateFocusable() {
    // 焦点优先放在之前焦点所在的元素上
    if (this.lastActiveItem) {
      this.items.forEach(
        (item) => (item.focusable = item.key === this.lastActiveItem.key),
      );
      return;
    }

    // 没有选中任何一项，焦点放在第一个 menu-item 上
    if (!this.selectedKeys.length) {
      this.itemsEnabled.forEach((item, index) => (item.focusable = !index));
      return;
    }

    // 如果是单选，焦点放在当前选中的元素上
    if (this.selects === 'single') {
      this.items.forEach(
        (item) => (item.focusable = this.selectedKeys.includes(item.key)),
      );
      return;
    }

    // 是多选，且原焦点不在 selectedKeys 上，焦点放在第一个选中的 menu-item 上
    if (this.selects === 'multiple') {
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

  protected updateSelected() {
    // 选中 menu-item
    this.items.forEach(
      (item) => (item.selected = this.selectedKeys.includes(item.key)),
    );
  }

  // 切换一个菜单项的选中状态
  private selectOne(item: MenuItem) {
    if (this.selects === 'multiple') {
      // 直接修改 this.selectedKeys 无法被 watch 监听到，需要先克隆一份 this.selectedKeys
      const selectedKeys = [...this.selectedKeys];
      if (selectedKeys.includes(item.key)) {
        selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
      } else {
        selectedKeys.push(item.key);
      }
      this.selectedKeys = selectedKeys;
    }

    if (this.selects === 'single') {
      if (this.selectedKeys.includes(item.key)) {
        this.selectedKeys = [];
      } else {
        this.selectedKeys = [item.key];
      }
    }

    this.updateSelected();
  }

  // 使一个 menu-item 可聚焦
  private focusableOne(item: MenuItem) {
    this.items.forEach((_item) => (_item.focusable = _item.key === item.key));
  }

  // 聚焦一个 menu-item
  protected async focusOne(item: MenuItem, options?: FocusOptions) {
    await delay(); // 等待 focusableMixin 更新完成
    item.focus();
  }

  protected onClick(event: MouseEvent) {
    if (this.isSubmenu) {
      return;
    }

    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest('mdui-menu-item') as MenuItem;

    if (item?.disabled) {
      return;
    }

    this.lastActiveItem = item;

    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }

    this.focusableOne(item);
    this.focusOne(item);
  }

  protected onKeyDown(event: KeyboardEvent) {
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
        this.focusableOne(item);
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
        this.focusableOne(items[index]);
        this.focusOne(items[index]);
        return;
      }
    }
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

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
      @keydown=${this.onKeyDown}
    ></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu': Menu;
  }
}
