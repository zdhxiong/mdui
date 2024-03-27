import { configureLocalization, LOCALE_STATUS_EVENT } from '@lit/localize';
import { sourceLocale, targetLocales } from './locale-codes.js';
import type { allLocales } from './locale-codes.js';
import type { LocaleModule } from '@lit/localize';

export type LoadFunc = (
  locale: (typeof targetLocales)[number],
) => Promise<LocaleModule>;

export type GetLocal = () => (typeof allLocales)[number];
export type SetLocal = (locale: (typeof allLocales)[number]) => Promise<void>;

export const uninitializedError =
  'You must call `loadLocale` first to set up the localized template.';

export let getLocale: GetLocal | undefined;
export let setLocale: SetLocal | undefined;

/**
 * 初始化 localization
 * @param loadFunc
 */
export const initializeLocalize = (loadFunc: LoadFunc) => {
  const result = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: loadFunc as (locale: string) => Promise<LocaleModule>,
  });

  getLocale = result.getLocale as unknown as GetLocal;
  setLocale = result.setLocale as unknown as SetLocal;
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
