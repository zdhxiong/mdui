import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues } from 'lit';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';

let isClick = true;
$(getDocument()).on({
  'pointerdown._focusable': () => {
    isClick = true;
  },
  'keydown._focusable': () => {
    isClick = false;
  },
});

/**
 * 参考：https://github.com/adobe/spectrum-web-components/blob/main/packages/shared/src/focusable.ts
 */
export const FocusableMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<LitElement> & T => {
  class FocusableMixinClass extends superclass {
    /**
     * 是否在页面加载时自动获得焦点
     */
    @property({ type: Boolean })
    public override autofocus = false;

    /**
     * 是否获得了焦点，不管是鼠标点击，还是键盘切换获得的焦点，都会添加该属性
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({ type: Boolean, reflect: true })
    protected focused = false;

    /**
     * 是否通过键盘切换获得了焦点
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({ type: Boolean, reflect: true, attribute: 'focus-visible' })
    protected focusVisible = false;

    /**
     * 父类要实现该属性，表示是否禁用 focus 状态
     */
    protected get focusDisabled(): boolean {
      throw new Error('Must implement focusDisabled getter!');
    }

    /**
     * 最终获得焦点的元素
     */
    protected get focusElement(): HTMLElement {
      throw new Error('Must implement focusElement getter!');
    }

    private _manipulatingTabindex = false;
    private _tabIndex = 0;
    private _lastFocusDisabled?: boolean;

    /**
     * 通过 Tab 键在元素之间切换焦点时，tabIndex 属性指定了元素获取焦点的顺序
     */
    @property({ type: Number })
    public override get tabIndex(): number {
      const $this = $(this);

      if (this.focusElement === this) {
        return Number($this.attr('tabindex') || -1);
      }

      const tabIndexAttribute = Number($this.attr('tabindex') || 0);

      if (this.focusDisabled || tabIndexAttribute < 0) {
        return -1;
      }

      if (!this.focusElement) {
        return tabIndexAttribute;
      }

      return this.focusElement.tabIndex;
    }
    public override set tabIndex(tabIndex: number) {
      if (this._manipulatingTabindex) {
        this._manipulatingTabindex = false;
        return;
      }

      const $this = $(this);

      if (this.focusElement === this) {
        if (tabIndex !== this.tabIndex) {
          if (tabIndex !== null) {
            this._tabIndex = tabIndex;
          }
          if (this.focusDisabled) {
            this.removeAttribute('tabindex');
          } else {
            $this.attr('tabindex', tabIndex);
          }
        }
        return;
      }

      if (tabIndex === -1) {
        $this.on('pointerdown._focusable', () => {
          if (this.tabIndex === -1) {
            this.tabIndex = 0;
            this.focus({ preventScroll: true });
          }
        });
      } else {
        this._manipulatingTabindex = true;
        $this.off('pointerdown._focusable');
      }

      if (tabIndex === -1 || this.focusDisabled) {
        this.setAttribute('tabindex', '-1');
        if (tabIndex !== -1) {
          this.manageFocusElementTabindex(tabIndex);
        }
        return;
      }

      if (this.hasAttribute('tabindex')) {
        this.removeAttribute('tabindex');
      } else {
        this._manipulatingTabindex = false;
      }
      this.manageFocusElementTabindex(tabIndex);
    }

    private async manageFocusElementTabindex(tabIndex: number): Promise<void> {
      if (!this.focusElement) {
        await this.updateComplete;
      }

      if (tabIndex === null) {
        this.focusElement.removeAttribute('tabindex');
      } else {
        this.focusElement.tabIndex = tabIndex;
      }
    }

    /**
     * 将焦点设置在当前元素上
     */
    public override focus(options?: FocusOptions): void {
      if (this.focusDisabled || !this.focusElement) {
        return;
      }

      if (this.focusElement !== this) {
        this.focusElement.focus(options);
      } else {
        HTMLElement.prototype.focus.apply(this, [options]);
      }
    }

    /**
     * 从当前元素中移除焦点
     */
    public override blur(): void {
      if (this.focusElement !== this) {
        this.focusElement.blur();
      } else {
        HTMLElement.prototype.blur.apply(this);
      }
    }

    /**
     * 模拟鼠标点击元素
     */
    public override click(): void {
      if (this.focusDisabled) {
        return;
      }

      if (this.focusElement !== this) {
        this.focusElement.click();
      } else {
        HTMLElement.prototype.click.apply(this);
      }
    }

    protected manageAutoFocus(): void {
      if (this.autofocus) {
        this.dispatchEvent(
          new KeyboardEvent('keydown', {
            code: 'Tab',
          }),
        );
        this.focusElement.focus();
      }
    }

    protected override firstUpdated(changes: PropertyValues): void {
      super.firstUpdated(changes);

      $(this.focusElement).on({
        'focus._focusable': () => {
          this.focused = true;
          this.focusVisible = !isClick;
        },
        'blur._focusable': () => {
          this.focused = false;
          this.focusVisible = false;
        },
      });
    }

    protected override update(changedProperties: PropertyValues): void {
      if (
        this._lastFocusDisabled === undefined ||
        this._lastFocusDisabled !== this.focusDisabled
      ) {
        this._lastFocusDisabled = this.focusDisabled;

        if (this.focusDisabled) {
          this.removeAttribute('tabindex');
        } else {
          if (this.focusElement === this) {
            this._manipulatingTabindex = true;
            $(this).attr('tabindex', this._tabIndex);
          } else {
            this.removeAttribute('tabindex');
          }
        }
      }

      super.update(changedProperties);
    }

    protected override updated(changedProperties: PropertyValues): void {
      super.updated(changedProperties);

      if (this.focused && this.focusDisabled) {
        this.blur();
      }
    }

    public override connectedCallback(): void {
      super.connectedCallback();
      this.updateComplete.then(() => {
        requestAnimationFrame(() => {
          this.manageAutoFocus();
        });
      });
    }
  }

  return FocusableMixinClass;
};
