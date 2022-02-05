import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
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
} from '@mdui/shared/src/helpers/touchHandler';
import { Ripple } from './index.js';

export const RippleMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<LitElement> => {
    class Mixin extends superclass {
      protected ripple!: Ripple;
      protected disabled!: boolean;

      protected canRun(event: Event): boolean {
        if (this.disabled) {
          return false;
        }

        if (isAllow(event)) {
          register(event);

          return true;
        }

        return false;
      }

      protected startPress(event: Event): void {
        if (!this.canRun(event)) {
          return;
        }

        const $target = $(this);

        // 手指触摸触发涟漪
        if (event.type === 'touchstart') {
          let hidden = false;

          // 手指触摸后，延迟一段时间触发涟漪，避免手指滑动时也触发涟漪
          let timer = setTimeout(() => {
            timer = 0;
            this.ripple.startPress(event);
          }, 70) as unknown as number;

          const hideRipple = () => {
            // 如果手指没有移动，且涟漪动画还没有开始，则开始涟漪动画
            if (timer) {
              clearTimeout(timer);
              timer = 0;
              this.ripple.startPress(event);
            }

            if (!hidden) {
              hidden = true;
              this.ripple.endPress();
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
            this.ripple.endPress();
            $target.off(`${endEvent} ${cancelEvent}`, hideRipple);
          };

          this.ripple.startPress(event);
          $target.on(`${endEvent} ${cancelEvent}`, hideRipple);
        }
      }

      protected endPress(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.endPress();
        }
      }

      protected startHover(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.startHover();
        }
      }

      protected endHover(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.endHover();
        }
      }

      protected startFocus(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.startFocus();
        }
      }

      protected endFocus(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.endFocus();
        }
      }

      protected startDrag(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.startDrag();
        }
      }

      protected endDrag(event: Event): void {
        if (this.canRun(event)) {
          this.ripple.endDrag();
        }
      }

      protected async firstUpdated() {
        $(this)
          .on(startEvent, (e) => this.startPress(e))
          .on('mouseenter', (e) => this.startHover(e))
          .on('mouseleave', (e) => this.endHover(e))
          .on(unlockEvent, register);
      }
    }

    return Mixin;
  },
);
