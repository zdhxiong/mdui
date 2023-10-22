import { getDocument } from 'ssr-window';
import { unique } from '@mdui/jq/functions/unique.js';
import { isDomReady } from '@mdui/jq/shared/dom.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

interface Options {
  /**
   * 是否在整个页面的 DOM 就绪后，才认为组件已定义完成
   *
   * 如果需要操作或读取组件外部、或组件 slot 中的原生 DOM 时，需要设置为 true
   */
  needDomReady?: boolean;

  /**
   * 是否在指定 Web Components 注册完成后，才认为组件定义完成。则 needDomReady 将默认为 true
   *
   * 若值为数组，则监听当前组件 slot 中的组件，如 ['mdui-segmented-button']
   * 若值为对象，则监听对象键名指定的组件，键值为 true，则监听整个页面的组件；否则监听 slot 中的组件
   *
   * 可以在数组中设置空字符串，或在对象中设置空字符串键名，来表示等待所有 Web Components 注册完成
   */
  relatedElements?: string[] | { [localName: string]: boolean };
}

/**
 * 判断组件是否定义完成
 *
 * 如果需要在组件操作或读取组件外部、或组件 slot 中的原生 DOM 时，则需要在 DOM 就绪时，才能认为组件定义完成
 * 如果组件需要和其他组件配合使用，则需要等待其他组件定义完成后，才能认为组件定义完成
 */
export class DefinedController implements ReactiveController {
  private host: ReactiveControllerHost & Element;

  /**
   * 组件是否已定义完成
   */
  private defined = false;

  /**
   * 是否在 DOM 就绪后，才算组件定义完成
   */
  private readonly needDomReady?: boolean;

  /**
   * 在哪些相关组件定义完成后，才算组件定义完成
   */
  private readonly relatedElements?:
    | string[]
    | { [localName: string]: boolean };

  public constructor(host: ReactiveControllerHost & Element, options: Options) {
    (this.host = host).addController(this);
    this.relatedElements = options.relatedElements;
    this.needDomReady = options.needDomReady || !!options.relatedElements;
    this.onSlotChange = this.onSlotChange.bind(this);
  }

  public hostConnected(): void {
    this.host.shadowRoot!.addEventListener('slotchange', this.onSlotChange);
  }

  public hostDisconnected(): void {
    this.host.shadowRoot!.removeEventListener('slotchange', this.onSlotChange);
  }

  /**
   * 判断组件是否定义完成
   */
  public isDefined(): boolean {
    if (this.defined) {
      return true;
    }

    this.defined =
      (!this.needDomReady || isDomReady()) &&
      !this.getUndefinedLocalNames().length;

    return this.defined;
  }

  /**
   * 在组件定义完成后，promise 被 resolve
   */
  public async whenDefined(): Promise<void> {
    if (this.defined) {
      return Promise.resolve();
    }

    const document = getDocument();

    if (this.needDomReady && !isDomReady(document)) {
      await new Promise<void>((resolve) => {
        document.addEventListener('DOMContentLoaded', () => resolve(), {
          once: true,
        });
      });
    }

    const undefinedLocalNames = this.getUndefinedLocalNames();
    if (undefinedLocalNames.length) {
      const promises: Promise<CustomElementConstructor>[] = [];
      undefinedLocalNames.forEach((localName) => {
        promises.push(customElements.whenDefined(localName));
      });

      await Promise.all(promises);
    }

    this.defined = true;

    return;
  }

  /**
   * slot 中的未完成定义的相关 Web components 组件的 CSS 选择器
   */
  private getScopeLocalNameSelector(): string | null {
    const localNames = this.relatedElements;

    if (!localNames) {
      return null;
    }

    if (Array.isArray(localNames)) {
      return localNames
        .map((localName) => `${localName}:not(:defined)`)
        .join(',');
    }

    return Object.keys(localNames)
      .filter((localName) => !localNames[localName])
      .map((localName) => `${localName}:not(:defined)`)
      .join(',');
  }

  /**
   * 整个页面中的未完成定义的相关 Web components 组件的 CSS 选择器
   */
  private getGlobalLocalNameSelector(): string | null {
    const localNames = this.relatedElements;

    if (!localNames || Array.isArray(localNames)) {
      return null;
    }

    return Object.keys(localNames)
      .filter((localName) => localNames[localName])
      .map((localName) => `${localName}:not(:defined)`)
      .join(',');
  }

  /**
   * 获取未完成定义的相关 Web components 组件名
   */
  private getUndefinedLocalNames(): string[] {
    const scopeSelector = this.getScopeLocalNameSelector();
    const globalSelector = this.getGlobalLocalNameSelector();

    const undefinedScopeElements = scopeSelector
      ? [...this.host.querySelectorAll(scopeSelector)]
      : [];
    const undefinedGlobalElements = globalSelector
      ? [...getDocument().querySelectorAll(globalSelector)]
      : [];

    const localNames = [
      ...undefinedScopeElements,
      ...undefinedGlobalElements,
    ].map((element) => element.localName);

    return unique(localNames);
  }

  /**
   * slot 变更时，若 slot 中包含未完成定义的相关 Web components 组件，则组件未定义完成
   */
  private onSlotChange(): void {
    const selector = this.getScopeLocalNameSelector();
    if (selector) {
      const undefinedElements = this.host.querySelectorAll(selector);
      if (undefinedElements.length) {
        this.defined = false;
      }
    }
  }
}
