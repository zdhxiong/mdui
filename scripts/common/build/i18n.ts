import fs from 'node:fs';
import path from 'node:path';

export type I18nLanguage = 'en' | 'zh-cn';
export const i18nLanguages: I18nLanguage[] = ['en', 'zh-cn'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type I18nData = any; // import(../../../docs/zh-cn.json)

export type I18nDataSection =
  | 'attributes'
  | 'properties'
  | 'methods'
  | 'events'
  | 'slots'
  | 'cssParts'
  | 'cssProperties';

// 为 properties 时为该对象，为 methods, events, slots, cssParts, cssProperties 时为字符串
export interface I18nDataItem {
  description: string;
  enum?: Record<string, string>;
}

const i18nDataMap: Map<I18nLanguage, I18nData> = new Map();

/**
 * 获取完整的 i18n 翻译数据
 */
export const getI18nData = (language: I18nLanguage): I18nData => {
  if (!i18nDataMap.has(language)) {
    i18nDataMap.set(
      language,
      JSON.parse(
        fs.readFileSync(path.resolve(`./docs/${language}.json`), 'utf8'),
      ),
    );
  }

  return i18nDataMap.get(language)!;
};

/**
 * 获取指定组件的指定属性的翻译文案
 */
export function getI18nItem(
  tagName: string,
  section: 'properties',
  name: string,
  language: I18nLanguage,
): I18nDataItem;
export function getI18nItem(
  tagName: string,
  section: I18nDataSection,
  name: string,
  language: I18nLanguage,
): string;
export function getI18nItem(
  tagName: string,
  section: I18nDataSection,
  name: string,
  language: I18nLanguage,
) {
  const i18nData = getI18nData(language);
  let item = i18nData[tagName][section as never]?.[name];

  // 如果组件中没有对应属性的翻译，从 superclass 中找
  if (!item) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item = Object.values<any>(i18nData.superclass)
      .filter((superclass) => superclass.tagNames.includes(tagName))
      .find((superclass) => superclass[section as never]?.[name])![
      section as never
    ]?.[name];
  }

  return item;
}
