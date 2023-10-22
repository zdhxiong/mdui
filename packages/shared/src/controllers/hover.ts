import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import { uniqueId } from '../helpers/uniqueId.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * 检查当前鼠标是否放在指定元素上，及进入、离开元素执行对于的回调
 */
export class HoverController implements ReactiveController {
  /**
   * 当前鼠标是否放在元素上
   */
  public isHover = false;

  private readonly host: ReactiveControllerHost & Element;
  private readonly elementRef;
  private readonly uniqueID = uniqueId();
  private readonly enterEventName = `mouseenter.${this.uniqueID}.hoverController`;
  private readonly leaveEventName = `mouseleave.${this.uniqueID}.hoverController`;
  private mouseEnterItems: { callback: () => void; one: boolean }[] = [];
  private mouseLeaveItems: { callback: () => void; one: boolean }[] = [];

  /**
   * @param host
   * @param elementRef 检查鼠标是否放在该元素上
   */
  public constructor(
    host: ReactiveControllerHost & Element,
    elementRef: Ref<HTMLElement>,
  ) {
    (this.host = host).addController(this);
    this.elementRef = elementRef;
  }

  public hostConnected(): void {
    this.host.updateComplete.then(() => {
      $(this.elementRef.value)
        .on(this.enterEventName, () => {
          this.isHover = true;

          for (let i = this.mouseEnterItems.length - 1; i >= 0; i--) {
            const item = this.mouseEnterItems[i];
            item.callback();
            if (item.one) {
              this.mouseEnterItems.splice(i, 1);
            }
          }
        })
        .on(this.leaveEventName, () => {
          this.isHover = false;

          for (let i = this.mouseLeaveItems.length - 1; i >= 0; i--) {
            const item = this.mouseLeaveItems[i];
            item.callback();
            if (item.one) {
              this.mouseLeaveItems.splice(i, 1);
            }
          }
        });
    });
  }

  public hostDisconnected(): void {
    $(this.elementRef.value).off(this.enterEventName).off(this.leaveEventName);
  }

  /**
   * 指定鼠标移入时的回调函数
   * @param callback 要执行的回调函数
   * @param one 是否仅执行一次
   */
  public onMouseEnter(callback: () => void, one = false): void {
    this.mouseEnterItems.push({ callback, one });
  }

  /**
   * 指定鼠标移出时的回调函数
   * @param callback 要执行的回调函数
   * @param one 是否仅执行一次
   */
  public onMouseLeave(callback: () => void, one = false): void {
    this.mouseLeaveItems.push({ callback, one });
  }
}
