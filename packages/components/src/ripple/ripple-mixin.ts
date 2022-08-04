import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import type { Ripple } from './index.js';
import './index.js';

/**
 * hover, pressed, dragged 三个属性用于添加到 :host 元素上，供 CSS 选择题添加样式
 *
 * TODO: dragged 功能
 *
 * NOTE:
 * 不支持触控的屏幕上事件顺序为：pointerdown -> (8ms) -> mousedown -> pointerup -> (1ms) -> mouseup -> (1ms) -> click
 *
 * 支持触控的屏幕上事件顺序为：pointerdown -> (8ms) -> touchstart -> pointerup -> (1ms) -> touchend -> (5ms) -> mousedown -> mouseup -> click
 * pointermove 比较灵敏，有可能触发了 pointermove 但没有触发 touchmove
 *
 * 支持触摸笔的屏幕上事件顺序为：todo
 */
export const RippleMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<LitElement> => {
    class Mixin extends superclass {
      /**
       * 父类要添加该属性，指向 <mdui-ripple> 元素
       */
      protected get rippleElement(): Ripple {
        throw new Error('Must implement ripple getter!');
      }

      /**
       * 父类要实现该属性，表示是否禁用 ripple
       */
      protected get rippleDisabled(): boolean {
        throw new Error('Must implement rippleDisabled getter!');
      }

      @property({ type: Boolean, reflect: true })
      protected hover = false;

      @property({ type: Boolean, reflect: true })
      protected pressed = false;

      @property({ type: Boolean, reflect: true })
      protected dragged = false;

      protected startHover(event: PointerEvent): void {
        if (event.pointerType !== 'mouse' || this.rippleDisabled) {
          return;
        }

        this.hover = true;
        this.rippleElement.startHover();
      }

      protected endHover(event: PointerEvent): void {
        if (event.pointerType !== 'mouse' || this.rippleDisabled) {
          return;
        }

        this.hover = false;
        this.rippleElement.endHover();
      }

      protected startFocus(): void {
        if (this.rippleDisabled) {
          return;
        }

        this.rippleElement.startFocus();
      }

      protected endFocus(): void {
        if (this.rippleDisabled) {
          return;
        }

        this.rippleElement.endFocus();
      }

      protected startPress(event: PointerEvent): void {
        if (this.rippleDisabled) {
          return;
        }

        this.pressed = true;

        const $target = $(this);

        // 手指触摸触发涟漪
        if (['touch', 'pen'].includes(event.pointerType)) {
          let hidden = false;

          // 手指触摸后，延迟一段时间触发涟漪，避免手指滑动时也触发涟漪
          let timer = setTimeout(() => {
            timer = 0;
            this.rippleElement.startPress(event);
          }, 70) as unknown as number;

          const hideRipple = () => {
            // 如果手指没有移动，且涟漪动画还没有开始，则开始涟漪动画
            if (timer) {
              clearTimeout(timer);
              timer = 0;
              this.rippleElement.startPress(event);
            }

            if (!hidden) {
              hidden = true;
              this.endPress();
            }

            $target.off('pointerup pointercancel', hideRipple);
          };

          // 手指移动后，移除涟漪动画
          const touchMove = (): void => {
            if (timer) {
              clearTimeout(timer);
              timer = 0;
            }

            $target.off('touchmove', touchMove);
          };

          // pointermove 事件过于灵敏，可能在未触发 touchmove 的情况下，触发了 pointermove 事件，导致正常的点击操作没有显示涟漪
          // 因此这里监听 touchmove 事件
          $target
            .on('touchmove', touchMove)
            .on('pointerup pointercancel', hideRipple);
        }

        // 鼠标点击触发涟漪，点击后立即触发涟漪（仅鼠标左键能触发涟漪）
        if (event.pointerType === 'mouse' && event.button === 0) {
          const hideRipple = () => {
            this.endPress();
            $target.off('pointerup pointercancel pointerleave', hideRipple);
          };

          this.rippleElement.startPress(event);
          $target.on('pointerup pointercancel pointerleave', hideRipple);
        }
      }

      protected endPress(): void {
        if (this.rippleDisabled) {
          return;
        }

        this.pressed = false;
        this.rippleElement.endPress();
      }

      protected startDrag(): void {
        if (this.rippleDisabled) {
          return;
        }

        this.rippleElement.startDrag();
      }

      protected endDrag(): void {
        if (this.rippleDisabled) {
          return;
        }

        this.rippleElement.endDrag();
      }

      protected async firstUpdated(changes: PropertyValues) {
        super.firstUpdated(changes);
        $(this).on({
          pointerdown: this.startPress,
          pointerenter: this.startHover,
          pointerleave: this.endHover,
          focus: this.startFocus,
          blur: this.endFocus,
        });
      }
    }

    return Mixin;
  },
);
