import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import {
  register,
  isAllow,
  startEvent,
  unlockEvent,
  endEvent,
  cancelEvent,
} from '@mdui/shared/helpers/touchHandler.js';
import type { Ripple } from './index.js';
import './index.js';

/**
 * hover, pressed, dragged 三个属性用于添加到 :host 元素上，供 CSS 选择题添加样式
 *
 * TODO: dragged 功能
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

      protected canRun(event: Event): boolean {
        if (this.rippleDisabled) {
          return false;
        }

        if (isAllow(event)) {
          register(event);

          return true;
        }

        return false;
      }

      protected startHover(event: Event): void {
        if (this.canRun(event)) {
          this.hover = true;
          this.rippleElement.startHover();
        }
      }

      protected endHover(event: Event): void {
        if (this.canRun(event)) {
          this.hover = false;
          this.rippleElement.endHover();
        }
      }

      protected startFocus(event: Event): void {
        if (this.canRun(event)) {
          this.rippleElement.startFocus();
        }
      }

      protected endFocus(event: Event): void {
        if (this.canRun(event)) {
          this.rippleElement.endFocus();
        }
      }

      protected startPress(event: Event): void {
        if (!this.canRun(event)) {
          return;
        }

        this.pressed = true;

        const $target = $(this);

        // 手指触摸触发涟漪
        if (event.type === 'touchstart') {
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
              this.endPress(event);
            }

            $target.off('touchend touchcancel', hideRipple);
          };

          // 手指移动后，移除涟漪动画
          const touchMove = (): void => {
            if (timer) {
              clearTimeout(timer);
              timer = 0;
            }

            $target.off('touchmove', touchMove);
          };

          $target
            .on('touchmove', touchMove)
            .on('touchend touchcancel', hideRipple);
        }

        // 鼠标点击触发涟漪，点击后立即触发涟漪（鼠标右键不触发涟漪）
        if (event.type === 'mousedown' && (event as MouseEvent).button !== 2) {
          const hideRipple = () => {
            this.endPress(event);
            $target.off(`${endEvent} ${cancelEvent}`, hideRipple);
          };

          this.rippleElement.startPress(event);
          $target.on(`${endEvent} ${cancelEvent}`, hideRipple);
        }
      }

      protected endPress(event: Event): void {
        if (this.canRun(event)) {
          this.pressed = false;
          this.rippleElement.endPress();
        }
      }

      protected startDrag(event: Event): void {
        if (this.canRun(event)) {
          this.rippleElement.startDrag();
        }
      }

      protected endDrag(event: Event): void {
        if (this.canRun(event)) {
          this.rippleElement.endDrag();
        }
      }

      protected async firstUpdated(changes: PropertyValues) {
        super.firstUpdated(changes);
        $(this).on({
          [startEvent]: this.startPress,
          mouseenter: this.startHover,
          mouseleave: this.endHover,
          [unlockEvent]: register,
          focus: this.startFocus,
          blur: this.endFocus,
        });
      }
    }

    return Mixin;
  },
);
