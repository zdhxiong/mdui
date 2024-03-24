import { configureLocalization, LOCALE_STATUS_EVENT } from '@lit/localize';
import { getWindow } from 'ssr-window';
import { sourceLocale, targetLocales } from './localeCodes.js';
import type { allLocales } from './localeCodes.js';
import type { LocaleModule, LocaleStatusEventDetail } from '@lit/localize';

export type LocaleTargetCode = (typeof targetLocales)[number];
export type LocaleCode = (typeof allLocales)[number];
export type LoadFunc = (locale: LocaleTargetCode) => Promise<LocaleModule>;
export type GetLocal = () => LocaleCode;
export type SetLocal = (locale: LocaleCode) => Promise<void>;

declare global {
  interface WindowEventMap {
    'mdui-localize-status': CustomEvent<LocaleStatusEventDetail>;
  }
}

export const uninitializedError =
  'You must call `loadLocale` first to set up the localized template.';

export let getLocale: GetLocal | undefined;
export let setLocale: SetLocal | undefined;

/**
 * 初始化 localization
 * @param loadFunc
 */
export const initializeLocalize = (loadFunc: LoadFunc) => {
  const window = getWindow();
  const result = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: loadFunc as (locale: string) => Promise<LocaleModule>,
  });

  getLocale = result.getLocale as unknown as GetLocal;
  setLocale = result.setLocale as unknown as SetLocal;

  window.addEventListener(LOCALE_STATUS_EVENT, (event) => {
    window.dispatchEvent(
      new CustomEvent('mdui-localize-status', {
        detail: event.detail,
      }),
    );
  });
};

let listeningLitLocalizeStatus = false;
const localeReadyCallbacksMap = new Map<HTMLElement, Array<() => void>>();

/**
 * 监听 localize ready 事件
 * @param target
 * @param callback
 */
export const onLocaleReady = (target: HTMLElement, callback: () => void) => {
  if (!listeningLitLocalizeStatus) {
    listeningLitLocalizeStatus = true;

    const window = getWindow();

    window.addEventListener(LOCALE_STATUS_EVENT, (event) => {
      if (event.detail.status === 'ready') {
        localeReadyCallbacksMap.forEach((callbacks) => {
          callbacks.forEach((cb) => cb());
        });
      }
    });
  }

  const callbacks = localeReadyCallbacksMap.get(target) || [];
  callbacks.push(callback);
  localeReadyCallbacksMap.set(target, callbacks);
};

/**
 * 取消监听 localize ready 事件
 * @param target
 */
export const offLocaleReady = (target: HTMLElement) => {
  localeReadyCallbacksMap.delete(target);
};
