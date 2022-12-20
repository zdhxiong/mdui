import { property } from 'lit/decorators.js';
import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/removeAttr.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues, LitElement } from 'lit';

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
    @property({
      type: Boolean,
      reflect: true,
      /**
       * 在原生的 HTML 中，布尔属性只要添加了属性名，不论属性值设置成什么，属性值都是 true
       * 但这里设置了 attr="false" 时，要把属性设置为 false
       *
       * 原因是：
       * 在 vue 中，通过 :attr="value" 设置属性时，vue 会优先从 DOM 属性中寻找是否存在 attr 属性名，
       * 若存在，则设置对应的 DOM 属性，否则设置对应的 attribute 属性
       * 但在 vue 的服务端渲染（ssr）时，不存在 DOM 对象，所以会把 attribute 属性设置成 attr="true" 或 attr="false"
       * 所以在 attribute 属性 attr="false" 时，需要把属性值转换为布尔值 false
       *
       * 这段代码不能封装成函数，否则生成 custom-elements.json 会识别不了
       * 这段注释仅在这里写一次，其他地方不再重复
       */
      converter: (value: string | null): boolean => value !== 'false',
    })
    public override autofocus = false;

    /**
     * 是否获得了焦点，不管是鼠标点击，还是键盘切换获得的焦点，都会添加该属性
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean => value !== 'false',
    })
    protected focused = false;

    /**
     * 是否通过键盘切换获得了焦点
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean => value !== 'false',
      attribute: 'focus-visible',
    })
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
    @property({ type: Number, attribute: 'tabindex' })
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
        if (tabIndex !== null) {
          this._tabIndex = tabIndex;
        }

        $this.attr('tabindex', this.focusDisabled ? null : tabIndex);

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
        $this.attr('tabindex', -1);
        if (tabIndex !== -1) {
          this.manageFocusElementTabindex(tabIndex);
        }
        return;
      }

      if (!this.hasAttribute('tabindex')) {
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

        const $this = $(this);

        if (this.focusDisabled) {
          $this.removeAttr('tabindex');
        } else {
          if (this.focusElement === this) {
            this._manipulatingTabindex = true;
            $this.attr('tabindex', this._tabIndex);
          } else if (this.tabIndex > -1) {
            $this.removeAttr('tabindex');
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
