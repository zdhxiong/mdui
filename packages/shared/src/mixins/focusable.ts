import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';

export const FocusableMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<LitElement> => {
  class FocusableMixinClass extends superclass {
    /**
     * 是否在页面加载时自动获得焦点
     */
    @property({ type: Boolean })
    public autofocus = false;

    /**
     * 父类要实现该属性，表示是否禁用 focus 状态
     */
    protected get focusableDisabled(): boolean {
      throw new Error('Must implement focusableDisabled getter!');
    }

    /**
     * 被代理的元素
     * focusProxiedElement 的元素获得焦点时，焦点会代理到 this 上
     */
    protected get focusProxiedElement(): HTMLElement | null {
      throw new Error('Must implement focusProxiedElement getter!');
    }

    private manipulatingTabindex = false;
    private _tabIndex = 0;

    /**
     * 通过 Tab 键在元素之间切换焦点时，tabIndex 属性指定了元素获取焦点的顺序
     */
    @property({ type: Number })
    public get tabIndex(): number {
      return Number($(this).attr('tabindex')) || -1;
    }
    public set tabIndex(tabIndex: number) {
      if (this.manipulatingTabindex) {
        this.manipulatingTabindex = false;
        return;
      }

      if (tabIndex !== this.tabIndex) {
        this._tabIndex = tabIndex;
        $(this).attr('tabindex', this.focusableDisabled ? -1 : tabIndex);
      }
    }

    /**
     * 将焦点设置在当前元素上
     */
    public focus(options?: FocusOptions): void {
      if (!this.focusableDisabled) {
        HTMLElement.prototype.focus.apply(this, [options]);
      }
    }

    /**
     * 从当前元素中移除焦点
     */
    public blur(): void {
      HTMLElement.prototype.blur.apply(this);
    }

    /**
     * 模拟鼠标点击元素
     */
    public click(): void {
      if (!this.focusableDisabled) {
        HTMLElement.prototype.click.apply(this);
      }
    }

    protected firstUpdated(changes: PropertyValues): void {
      super.firstUpdated(changes);

      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      }

      if (this.autofocus) {
        this.focus();
      }

      this.addEventListener('keydown', (event) => {
        if (document.activeElement === this && event.code === 'Space') {
          this.focusProxiedElement?.click();
        }
      });
    }

    /**
     * 需要在父类中监听指定属性，并调用该方法
     * 如 @watch('disabled') @watch('loading')
     */
    protected async onDisabledUpdate() {
      this.manipulatingTabindex = true;
      $(this)
        .attr('tabindex', this.focusableDisabled ? -1 : this._tabIndex)
        .css('pointer-events', this.focusableDisabled ? 'none' : '');

      await this.updateComplete;

      if (this.focusableDisabled) {
        this.blur();
      }
    }

    private proxyFocus(): void {
      this.focus();
    }

    protected updated(changed: PropertyValues): void {
      super.updated(changed);

      if (!this.focusProxiedElement) {
        return;
      }

      $(this.focusProxiedElement)
        .off('focus')
        .on('focus', this.proxyFocus)
        .each((_, element) => (element.tabIndex = -1));
    }
  }

  return FocusableMixinClass;
};
