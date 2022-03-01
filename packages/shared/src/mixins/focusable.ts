import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';
import { $ } from '@mdui/jq/$.js';
import { watch } from '../decorators/watch.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';

export const FocusableMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<LitElement> => {
    class Mixin extends superclass {
      /**
       * 渲染完组件后，自动聚焦到该组件
       */
      @property({ type: Boolean })
      public autofocus = false;

      protected get disabled(): boolean {
        throw new Error('Must implement disabled getter!');
      }

      /**
       * 被代理的元素
       * focusProxiedElements 的元素获得焦点时，焦点会代理到 this 上
       */
      protected get focusProxiedElements(): HTMLElement[] {
        throw new Error('Must implement focusProxiedElements getter!');
      }

      private manipulatingTabindex = false;
      private _tabIndex = 0;

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
          $(this).attr('tabindex', this.disabled ? -1 : tabIndex);
        }
      }

      public focus(options?: FocusOptions): void {
        if (!this.disabled) {
          HTMLElement.prototype.focus.apply(this, [options]);
        }
      }

      public blur(): void {
        HTMLElement.prototype.blur.apply(this);
      }

      public click(): void {
        if (!this.disabled) {
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
          this.focus();
        }
      }

      protected firstUpdated(changes: PropertyValues): void {
        super.firstUpdated(changes);

        if (!this.hasAttribute('tabindex')) {
          this.tabIndex = 0;
        }

        this.manageAutoFocus();
      }

      @watch('disabled')
      protected async onDisabledUpdate() {
        this.manipulatingTabindex = true;
        $(this).attr('tabindex', this.disabled ? -1 : this._tabIndex);

        await this.updateComplete;

        if (this.disabled) {
          this.blur();
        }
      }

      private proxyFocus(): void {
        this.focus();
      }

      protected updated(changed: PropertyValues): void {
        super.updated(changed);

        if (!this.focusProxiedElements.length) {
          return;
        }

        $(this.focusProxiedElements)
          .off('focus')
          .on('focus', this.proxyFocus)
          .each((_, element) => (element.tabIndex = -1));
      }
    }

    return Mixin;
  },
);
