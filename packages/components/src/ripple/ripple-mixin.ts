import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/index.js';
import { isArrayLike } from '@mdui/jq/shared/helper.js';
import './index.js';
import type { Ripple } from './index.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PropertyValues, LitElement } from 'lit';

export declare class RippleMixinInterface extends LitElement {
  protected getRippleIndex: () => number | undefined;
  protected get rippleElement(): Ripple | Ripple[] | NodeListOf<Ripple>;
  protected get rippleDisabled(): boolean | boolean[];
  protected get rippleTarget():
    | HTMLElement
    | HTMLElement[]
    | NodeListOf<HTMLElement>;
  protected startHover(event: PointerEvent): void;
  protected endHover(event: PointerEvent): void;
}

/**
 * hover, pressed, dragged 三个属性用于添加到 rippleTarget 属性指定的元素上，供 CSS 选择题添加样式
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
export const RippleMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<RippleMixinInterface> & T => {
  class Mixin extends superclass {
    /**
     * 当前激活的是第几个 <mdui-ripple>。仅一个组件中有多个 <mdui-ripple> 时可以使用该属性
     * 若值为 undefined，则组件中所有 <mdui-ripple> 都激活
     */
    private rippleIndex?: number = undefined;

    /**
     * 子类要添加该属性，指向 <mdui-ripple> 元素
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组或 NodeList
     */
    protected get rippleElement(): Ripple | Ripple[] | NodeListOf<Ripple> {
      throw new Error('Must implement rippleElement getter!');
    }

    /**
     * 子类要实现该属性，表示是否禁用 ripple
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组；也可以是单个值，同时控制多个 <mdui-ripple> 元素
     */
    protected get rippleDisabled(): boolean | boolean[] {
      throw new Error('Must implement rippleDisabled getter!');
    }

    /**
     * 当前 <mdui-ripple> 元素相对于哪个元素存在，即 hover、pressed、dragged 属性要添加到哪个元素上，默认为 :host
     * 如果需要修改该属性，则子类可以实现该属性
     * 如果一个组件中包含多个 <mdui-ripple> 元素，则这里可以是一个数组；也可以是单个值，同时控制多个 <mdui-ripple> 元素
     */
    protected get rippleTarget():
      | HTMLElement
      | HTMLElement[]
      | NodeListOf<HTMLElement> {
      return this;
    }

    protected override firstUpdated(changedProperties: PropertyValues): void {
      super.firstUpdated(changedProperties);

      const $rippleTarget = $(this.rippleTarget);

      // 监听到事件时，是在第几个 <mdui-ripple> 上触发的事件，记录到 this.rippleIndex 中
      const setRippleIndex = (event: Event) => {
        if (isArrayLike(this.rippleTarget)) {
          this.rippleIndex = $rippleTarget.index(event.target as HTMLElement);
        }
      };

      const rippleTargetArr = isArrayLike(this.rippleTarget)
        ? this.rippleTarget
        : [this.rippleTarget];

      rippleTargetArr.forEach((rippleTarget) => {
        rippleTarget.addEventListener('pointerdown', (event: PointerEvent) => {
          setRippleIndex(event);
          this.startPress(event);
        });

        rippleTarget.addEventListener('pointerenter', (event: PointerEvent) => {
          setRippleIndex(event);
          this.startHover(event);
        });

        rippleTarget.addEventListener('pointerleave', (event: PointerEvent) => {
          setRippleIndex(event);
          this.endHover(event);
        });

        rippleTarget.addEventListener('focus', (event: FocusEvent) => {
          setRippleIndex(event);
          this.startFocus();
        });

        rippleTarget.addEventListener('blur', (event: FocusEvent) => {
          setRippleIndex(event);
          this.endFocus();
        });
      });
    }

    /**
     * 获取当前激活的是第几个 <mdui-ripple>。仅一个组件中有多个 <mdui-ripple> 时可以使用该属性
     * 若值为 undefined，则组件中所有 <mdui-ripple> 都激活
     * 可在子类中手动指定该方法，指定需要激活的 ripple
     */
    protected getRippleIndex: () => number | undefined = () => this.rippleIndex;

    /**
     * 若存在多个 <mdui-ripple>，但 rippleTarget 为同一个，则 hover 状态无法在多个 <mdui-ripple> 之间切换
     * 所以把 startHover 和 endHover 设置为 protected，供子类调用
     * 子类中，在 getRippleIndex() 的返回值变更前调用 endHover(event)，变更后调用 startHover(event)
     */
    protected startHover(event: PointerEvent): void {
      if (event.pointerType !== 'mouse' || this.isRippleDisabled()) {
        return;
      }

      this.getRippleTarget().setAttribute('hover', '');
      this.getRippleElement().startHover();
    }

    protected endHover(event: PointerEvent): void {
      if (event.pointerType !== 'mouse' || this.isRippleDisabled()) {
        return;
      }

      this.getRippleTarget().removeAttribute('hover');
      this.getRippleElement().endHover();
    }

    /**
     * 当前激活的 <mdui-ripple> 元素是否被禁用
     */
    private isRippleDisabled(): boolean {
      const disabled = this.rippleDisabled;

      if (!Array.isArray(disabled)) {
        return disabled;
      }

      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== undefined) {
        return disabled[rippleIndex];
      }

      return disabled.length ? disabled[0] : false;
    }

    /**
     * 获取当前激活的 <mdui-ripple> 元素实例
     */
    private getRippleElement(): Ripple {
      const ripple = this.rippleElement;

      if (!isArrayLike(ripple)) {
        return ripple;
      }

      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== undefined) {
        return ripple[rippleIndex];
      }

      return ripple[0];
    }

    /**
     * 获取当前激活的 <mdui-ripple> 元素相对于哪个元素存在
     */
    private getRippleTarget(): HTMLElement {
      const target = this.rippleTarget;

      if (!isArrayLike(target)) {
        return target;
      }

      const rippleIndex = this.getRippleIndex();
      if (rippleIndex !== undefined) {
        return target[rippleIndex];
      }

      return target[0];
    }

    private startFocus(): void {
      if (this.isRippleDisabled()) {
        return;
      }

      this.getRippleElement().startFocus();
    }

    private endFocus(): void {
      if (this.isRippleDisabled()) {
        return;
      }

      this.getRippleElement().endFocus();
    }

    private startPress(event: PointerEvent): void {
      // 为鼠标时操作，仅响应鼠标左键点击
      if (this.isRippleDisabled() || event.button) {
        return;
      }

      const target = this.getRippleTarget();
      target.setAttribute('pressed', '');

      // 手指触摸触发涟漪
      if (['touch', 'pen'].includes(event.pointerType)) {
        let hidden = false;

        // 手指触摸后，延迟一段时间触发涟漪，避免手指滑动时也触发涟漪
        let timer = setTimeout(() => {
          timer = 0;
          this.getRippleElement().startPress(event);
        }, 70) as unknown as number;

        const hideRipple = () => {
          // 如果手指没有移动，且涟漪动画还没有开始，则开始涟漪动画
          if (timer) {
            clearTimeout(timer);
            timer = 0;
            this.getRippleElement().startPress(event);
          }

          if (!hidden) {
            hidden = true;
            this.endPress();
          }

          target.removeEventListener('pointerup', hideRipple);
          target.removeEventListener('pointercancel', hideRipple);
        };

        // 手指移动后，移除涟漪动画
        const touchMove = (): void => {
          if (timer) {
            clearTimeout(timer);
            timer = 0;
          }

          target.removeEventListener('touchmove', touchMove);
        };

        // pointermove 事件过于灵敏，可能在未触发 touchmove 的情况下，触发了 pointermove 事件，导致正常的点击操作没有显示涟漪
        // 因此这里监听 touchmove 事件
        target.addEventListener('touchmove', touchMove);
        target.addEventListener('pointerup', hideRipple);
        target.addEventListener('pointercancel', hideRipple);
      }

      // 鼠标点击触发涟漪，点击后立即触发涟漪（仅鼠标左键能触发涟漪）
      if (event.pointerType === 'mouse' && event.button === 0) {
        const hideRipple = () => {
          this.endPress();

          target.removeEventListener('pointerup', hideRipple);
          target.removeEventListener('pointercancel', hideRipple);
          target.removeEventListener('pointerleave', hideRipple);
        };

        this.getRippleElement().startPress(event);

        target.addEventListener('pointerup', hideRipple);
        target.addEventListener('pointercancel', hideRipple);
        target.addEventListener('pointerleave', hideRipple);
      }
    }

    private endPress(): void {
      if (this.isRippleDisabled()) {
        return;
      }

      this.getRippleTarget().removeAttribute('pressed');
      this.getRippleElement().endPress();
    }

    private startDrag(): void {
      if (this.isRippleDisabled()) {
        return;
      }

      this.getRippleElement().startDrag();
    }

    private endDrag(): void {
      if (this.isRippleDisabled()) {
        return;
      }

      this.getRippleElement().endDrag();
    }
  }

  // @ts-ignore
  return Mixin;
};
