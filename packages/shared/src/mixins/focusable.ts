import { property } from 'lit/decorators.js';
import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/removeAttr.js';
import { DefinedController } from '../controllers/defined.js';
import { booleanConverter } from '../helpers/decorator.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues, LitElement } from 'lit';

let isClick = true;
const document = getDocument();

document.addEventListener('pointerdown', () => {
  isClick = true;
});
document.addEventListener('keydown', () => {
  isClick = false;
});

export declare class FocusableMixinInterface {
  public autofocus: boolean;
  public tabIndex: number;
  protected get focusDisabled(): boolean;
  protected get focusElement(): HTMLElement | null | undefined;
  public focus(options?: FocusOptions): void;
  public blur(): void;
  public click(): void;
}

/**
 * 参考：https://github.com/adobe/spectrum-web-components/blob/main/tools/shared/src/focusable.ts
 */
export const FocusableMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<FocusableMixinInterface> & T => {
  class FocusableMixinClass extends superclass {
    /**
     * 是否在页面加载完成后自动获得焦点
     */
    @property({
      type: Boolean,
      /**
       * 哪些属性需要 reflect: true？
       * 一般所有属性都需要 reflect，但以下情况除外：
       * 1. 会频繁变更的属性
       * 2. 属性同步会造成较大性能开销的属性
       * 3. 复杂类型属性（数组、对象等，仅提供 property，不提供 attribute）
       */
      reflect: true,
      converter: booleanConverter,
    })
    public override autofocus = false;

    /**
     * 是否获得了焦点，不管是鼠标点击，还是键盘切换获得的焦点，都会添加该属性
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: booleanConverter,
    })
    private focused = false;

    /**
     * 是否通过键盘切换获得了焦点
     * 添加到 :host 元素上，供 CSS 选择器添加样式
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: booleanConverter,
      attribute: 'focus-visible',
    })
    private focusVisible = false;

    protected focusableDefinedController: DefinedController =
      new DefinedController(this, { relatedElements: [''] });

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

      const onPointerDown = () => {
        if (this.tabIndex === -1) {
          this.tabIndex = 0;
          this.focus({ preventScroll: true });
        }
      };

      if (tabIndex === -1) {
        this.addEventListener('pointerdown', onPointerDown);
      } else {
        this._manipulatingTabindex = true;
        this.removeEventListener('pointerdown', onPointerDown);
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

    /**
     * 父类要实现该属性，表示是否禁用 focus 状态
     */
    protected get focusDisabled(): boolean {
      throw new Error('Must implement focusDisabled getter!');
    }

    /**
     * 最终获得焦点的元素
     */
    protected get focusElement(): HTMLElement | null | undefined {
      throw new Error('Must implement focusElement getter!');
    }

    public override connectedCallback(): void {
      super.connectedCallback();

      this.updateComplete.then(() => {
        requestAnimationFrame(() => {
          this.manageAutoFocus();
        });
      });
    }

    /**
     * 模拟鼠标点击元素
     */
    public override click(): void {
      if (this.focusDisabled) {
        return;
      }

      if (this.focusElement !== this) {
        this.focusElement!.click();
      } else {
        HTMLElement.prototype.click.apply(this);
      }
    }

    /**
     * 将焦点设置在当前元素。
     *
     * 可传入一个对象作为参数。对象属性为：
     *
     * * `preventScroll`：默认情况下，在聚焦后会滚动页面，以将聚焦的元素滚动到视图中。可将该属性设为 `true` 以阻止页面滚动。
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
        this.focusElement!.blur();
      } else {
        HTMLElement.prototype.blur.apply(this);
      }
    }

    protected override firstUpdated(changedProperties: PropertyValues): void {
      super.firstUpdated(changedProperties);

      this.focusElement!.addEventListener('focus', () => {
        this.focused = true;
        this.focusVisible = !isClick;
      });
      this.focusElement!.addEventListener('blur', () => {
        this.focused = false;
        this.focusVisible = false;
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

    private async manageFocusElementTabindex(tabIndex: number): Promise<void> {
      if (!this.focusElement) {
        await this.updateComplete;
      }

      if (tabIndex === null) {
        this.focusElement!.removeAttribute('tabindex');
      } else {
        this.focusElement!.tabIndex = tabIndex;
      }
    }

    private manageAutoFocus(): void {
      if (this.autofocus) {
        this.dispatchEvent(
          new KeyboardEvent('keydown', {
            code: 'Tab',
          }),
        );
        this.focusElement!.focus();
      }
    }
  }

  return FocusableMixinClass as unknown as Constructor<FocusableMixinInterface> &
    T;
};
