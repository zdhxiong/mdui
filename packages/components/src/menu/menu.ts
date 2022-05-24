import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { watch } from '@mdui/shared/decorators/watch';
import { menuStyle } from './menu-style.js';
import { MenuItem } from './menu-item.js';

/**
 * @event change - 选中一个菜单项时触发
 *
 * @slot - 子菜单项、分割线等元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-menu')
export class Menu extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, menuStyle];

  @queryAssignedElements({ selector: 'mdui-menu-item', flatten: true })
  protected itemElements!: MenuItem[] | null;

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
   * 当前选中的 `<mdui-menu-item>` 的值。若为多选，则多个值会用 `,` 分隔
   */
  @property({ reflect: true })
  public get value(): string {
    if (!this.selects || !this.itemElements) {
      return '';
    }

    return this.itemElements
      .filter((itemElement) => itemElement.selected)
      .map((itemElement) => itemElement.value)
      .join(',');
  }
  public set value(value: string) {
    if (!this.selects) {
      return;
    }

    const valueArr = this.selects === 'multiple' ? value.split(',') : [value];

    this.itemElements?.forEach((itemElement) => {
      itemElement.selected = valueArr.includes(itemElement.value);
    });
  }

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

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }

  @watch('dense')
  @watch('selects')
  @watch('submenuTrigger')
  @watch('submenuOpenDelay')
  @watch('submenuCloseDelay')
  protected onSlotChange() {
    const itemElements = this.itemElements ?? [];

    itemElements.forEach((itemElement) => {
      // @ts-ignore
      itemElement.dense = this.dense;
      // @ts-ignore
      itemElement.selects = this.selects;
      // @ts-ignore
      itemElement.submenuTrigger = this.submenuTrigger;
      // @ts-ignore
      itemElement.submenuOpenDelay = this.submenuOpenDelay;
      // @ts-ignore
      itemElement.submenuCloseDelay = this.submenuCloseDelay;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu': Menu;
  }
}
