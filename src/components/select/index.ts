/**
 * 最终生成的元素结构为：
 *  <select class="mdui-select" mdui-select="{position: 'top'}" style="display: none;"> // $native
 *    <option value="1">State 1</option>
 *    <option value="2">State 2</option>
 *    <option value="3" disabled="">State 3</option>
 *  </select>
 *  <div class="mdui-select mdui-select-position-top" style="" id="88dec0e4-d4a2-c6d0-0e7f-1ba4501e0553"> // $element
 *    <span class="mdui-select-selected">State 1</span> // $selected
 *    <div class="mdui-select-menu" style="transform-origin: center 100% 0px;"> // $menu
 *      <div class="mdui-select-menu-item mdui-ripple" selected="">State 1</div> // $items
 *      <div class="mdui-select-menu-item mdui-ripple">State 2</div>
 *      <div class="mdui-select-menu-item mdui-ripple" disabled="">State 3</div>
 *    </div>
 *  </div>
 */

import $ from 'mdui.jq/es/$';
import contains from 'mdui.jq/es/functions/contains';
import extend from 'mdui.jq/es/functions/extend';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/add';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/after';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/index';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeAttr';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/show';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/trigger';
import 'mdui.jq/es/methods/val';
import Selector from 'mdui.jq/es/types/Selector';
import mdui from '../../mdui';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/guid';
import { componentEvent } from '../../utils/componentEvent';
import { $document, $window } from '../../utils/dom';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 下拉选择组件
     *
     * 请通过 `new mdui.Select()` 调用
     */
    Select: {
      /**
       * 实例化 Select 组件
       * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Select;
    };
  }
}

type OPTIONS = {
  /**
   * 下拉框位置：`auto`、`top`、`bottom`
   */
  position?: 'auto' | 'top' | 'bottom';

  /**
   * 菜单与窗口上下边框至少保持多少间距
   */
  gutter?: number;
};

type STATE = 'closing' | 'closed' | 'opening' | 'opened';
type EVENT = 'open' | 'opened' | 'close' | 'closed';

const DEFAULT_OPTIONS: OPTIONS = {
  position: 'auto',
  gutter: 16,
};

class Select {
  /**
   * 原生 `<select>` 元素的 JQ 对象
   */
  public $native: JQ<HTMLSelectElement>;

  /**
   * 生成的 `<div class="mdui-select">` 元素的 JQ 对象
   */
  public $element: JQ = $();

  /**
   * 配置参数
   */
  public options: OPTIONS = extend({}, DEFAULT_OPTIONS);

  /**
   * select 的 size 属性的值，根据该值设置 select 的高度
   */
  private size = 0;

  /**
   * 占位元素，显示已选中菜单项的文本
   */
  private $selected: JQ = $();

  /**
   * 菜单项的外层元素的 JQ 对象
   */
  private $menu: JQ = $();

  /**
   * 菜单项数组的 JQ 对象
   */
  private $items: JQ = $();

  /**
   * 当前选中的菜单项的索引号
   */
  private selectedIndex = 0;

  /**
   * 当前选中菜单项的文本
   */
  private selectedText = '';

  /**
   * 当前选中菜单项的值
   */
  private selectedValue = '';

  /**
   * 唯一 ID
   */
  private uniqueID: string;

  /**
   * 当前 select 的状态
   */
  private state: STATE = 'closed';

  public constructor(
    selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
    options: OPTIONS = {},
  ) {
    this.$native = $(selector).first() as JQ<HTMLSelectElement>;
    this.$native.hide();

    extend(this.options, options);

    // 为当前 select 生成唯一 ID
    this.uniqueID = $.guid();

    // 生成 select
    this.handleUpdate();

    // 点击 select 外面区域关闭
    $document.on('click touchstart', (event: Event) => {
      const $target = $(event.target as HTMLElement);

      if (
        this.isOpen() &&
        !$target.is(this.$element) &&
        !contains(this.$element[0], $target[0])
      ) {
        this.close();
      }
    });
  }

  /**
   * 调整菜单位置
   */
  private readjustMenu(): void {
    const windowHeight = $window.height();

    // mdui-select 高度
    const elementHeight = this.$element.height();

    // 菜单项高度
    const $itemFirst = this.$items.first();
    const itemHeight = $itemFirst.height();
    const itemMargin = parseInt($itemFirst.css('margin-top'));

    // 菜单高度
    const menuWidth = this.$element.innerWidth() + 0.01; // 必须比真实宽度多一点，不然会出现省略号
    let menuHeight = itemHeight * this.size + itemMargin * 2;

    // mdui-select 在窗口中的位置
    const elementTop = this.$element[0].getBoundingClientRect().top;

    let transformOriginY: string;
    let menuMarginTop: number;

    if (this.options.position === 'bottom') {
      menuMarginTop = elementHeight;
      transformOriginY = '0px';
    } else if (this.options.position === 'top') {
      menuMarginTop = -menuHeight - 1;
      transformOriginY = '100%';
    } else {
      // 菜单高度不能超过窗口高度
      const menuMaxHeight = windowHeight - this.options.gutter! * 2;
      if (menuHeight > menuMaxHeight) {
        menuHeight = menuMaxHeight;
      }

      // 菜单的 margin-top
      menuMarginTop = -(
        itemMargin +
        this.selectedIndex * itemHeight +
        (itemHeight - elementHeight) / 2
      );

      const menuMaxMarginTop = -(
        itemMargin +
        (this.size - 1) * itemHeight +
        (itemHeight - elementHeight) / 2
      );
      if (menuMarginTop < menuMaxMarginTop) {
        menuMarginTop = menuMaxMarginTop;
      }

      // 菜单不能超出窗口
      const menuTop = elementTop + menuMarginTop;
      if (menuTop < this.options.gutter!) {
        // 不能超出窗口上方
        menuMarginTop = -(elementTop - this.options.gutter!);
      } else if (menuTop + menuHeight + this.options.gutter! > windowHeight) {
        // 不能超出窗口下方
        menuMarginTop = -(
          elementTop +
          menuHeight +
          this.options.gutter! -
          windowHeight
        );
      }

      // transform 的 Y 轴坐标
      transformOriginY = `${
        this.selectedIndex * itemHeight + itemHeight / 2 + itemMargin
      }px`;
    }

    // 设置样式
    this.$element.innerWidth(menuWidth);
    this.$menu
      .innerWidth(menuWidth)
      .height(menuHeight)
      .css({
        'margin-top': menuMarginTop + 'px',
        'transform-origin': 'center ' + transformOriginY + ' 0',
      });
  }

  /**
   * select 是否为打开状态
   */
  private isOpen(): boolean {
    return this.state === 'opening' || this.state === 'opened';
  }

  /**
   * 对原生 select 组件进行了修改后，需要调用该方法
   */
  public handleUpdate(): void {
    if (this.isOpen()) {
      this.close();
    }

    this.selectedValue = this.$native.val() as string;

    // 保存菜单项数据的数组
    type typeItemsData = {
      value: string;
      text: string;
      disabled: boolean;
      selected: boolean;
      index: number;
    };
    const itemsData: typeItemsData[] = [];
    this.$items = $();

    // 生成 HTML
    this.$native.find('option').each((index, option) => {
      const text = option.textContent || '';
      const value = option.value;
      const disabled = option.disabled;
      const selected = this.selectedValue === value;

      itemsData.push({
        value,
        text,
        disabled,
        selected,
        index,
      });

      if (selected) {
        this.selectedText = text;
        this.selectedIndex = index;
      }

      this.$items = this.$items.add(
        '<div class="mdui-select-menu-item mdui-ripple"' +
          (disabled ? ' disabled' : '') +
          (selected ? ' selected' : '') +
          `>${text}</div>`,
      );
    });

    this.$selected = $(
      `<span class="mdui-select-selected">${this.selectedText}</span>`,
    );

    this.$element = $(
      `<div class="mdui-select mdui-select-position-${this.options.position}" ` +
        `style="${this.$native.attr('style')}" ` +
        `id="${this.uniqueID}"></div>`,
    )
      .show()
      .append(this.$selected);

    this.$menu = $('<div class="mdui-select-menu"></div>')
      .appendTo(this.$element)
      .append(this.$items);

    $(`#${this.uniqueID}`).remove();
    this.$native.after(this.$element);

    // 根据 select 的 size 属性设置高度
    this.size = parseInt(this.$native.attr('size') || '0');

    if (this.size <= 0) {
      this.size = this.$items.length;

      if (this.size > 8) {
        this.size = 8;
      }
    }

    // 点击选项时关闭下拉菜单
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.$items.on('click', function () {
      if (that.state === 'closing') {
        return;
      }

      const $item = $(this);
      const index = $item.index();
      const data = itemsData[index];

      if (data.disabled) {
        return;
      }

      that.$selected.text(data.text);
      that.$native.val(data.value);
      that.$items.removeAttr('selected');
      $item.attr('selected', '');
      that.selectedIndex = data.index;
      that.selectedValue = data.value;
      that.selectedText = data.text;
      that.$native.trigger('change');
      that.close();
    });

    // 点击 $element 时打开下拉菜单
    this.$element.on('click', (event: Event) => {
      const $target = $(event.target as HTMLElement);

      // 在菜单上点击时不打开
      if (
        $target.is('.mdui-select-menu') ||
        $target.is('.mdui-select-menu-item')
      ) {
        return;
      }

      this.toggle();
    });
  }

  /**
   * 动画结束的回调
   */
  private transitionEnd(): void {
    this.$element.removeClass('mdui-select-closing');

    if (this.state === 'opening') {
      this.state = 'opened';
      this.triggerEvent('opened');
      this.$menu.css('overflow-y', 'auto');
    }

    if (this.state === 'closing') {
      this.state = 'closed';
      this.triggerEvent('closed');

      // 恢复样式
      this.$element.innerWidth('');
      this.$menu.css({
        'margin-top': '',
        height: '',
        width: '',
      });
    }
  }

  /**
   * 触发组件事件
   * @param name
   */
  private triggerEvent(name: EVENT): void {
    componentEvent(name, 'select', this.$native, this);
  }

  /**
   * 切换下拉菜单的打开状态
   */
  public toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /**
   * 打开下拉菜单
   */
  public open(): void {
    if (this.isOpen()) {
      return;
    }

    this.state = 'opening';
    this.triggerEvent('open');
    this.readjustMenu();
    this.$element.addClass('mdui-select-open');
    this.$menu.transitionEnd(() => this.transitionEnd());
  }

  /**
   * 关闭下拉菜单
   */
  public close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.state = 'closing';
    this.triggerEvent('close');
    this.$menu.css('overflow-y', '');
    this.$element
      .removeClass('mdui-select-open')
      .addClass('mdui-select-closing');
    this.$menu.transitionEnd(() => this.transitionEnd());
  }

  /**
   * 获取当前菜单的状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
   */
  public getState(): STATE {
    return this.state;
  }
}

mdui.Select = Select;
