import { I18nLanguage } from './i18n.js';

export const docOrigin = 'https://www.mdui.org';

// 文档页面 及 页面中包含的组件：pageName => tagName[]
const docComponents: Record<string, string[]> = {
  button: ['mdui-button'],
  'button-icon': ['mdui-button-icon'],
  fab: ['mdui-fab'],
  'segmented-button': ['mdui-segmented-button-group', 'mdui-segmented-button'],
  chip: ['mdui-chip'],
  card: ['mdui-card'],
  checkbox: ['mdui-checkbox'],
  radio: ['mdui-radio-group', 'mdui-radio'],
  switch: ['mdui-switch'],
  slider: ['mdui-slider'],
  'range-slider': ['mdui-range-slider'],
  list: ['mdui-list', 'mdui-list-item', 'mdui-list-subheader'],
  collapse: ['mdui-collapse', 'mdui-collapse-item'],
  tabs: ['mdui-tabs', 'mdui-tab', 'mdui-tab-panel'],
  dropdown: ['mdui-dropdown'],
  menu: ['mdui-menu', 'mdui-menu-item'],
  select: ['mdui-select'],
  'text-field': ['mdui-text-field'],
  'linear-progress': ['mdui-linear-progress'],
  'circular-progress': ['mdui-circular-progress'],
  dialog: ['mdui-dialog'],
  divider: ['mdui-divider'],
  avatar: ['mdui-avatar'],
  badge: ['mdui-badge'],
  icon: ['mdui-icon'],
  tooltip: ['mdui-tooltip'],
  snackbar: ['mdui-snackbar'],
  'navigation-bar': ['mdui-navigation-bar', 'mdui-navigation-bar-item'],
  'navigation-drawer': ['mdui-navigation-drawer'],
  'navigation-rail': ['mdui-navigation-rail', 'mdui-navigation-rail-item'],
  'bottom-app-bar': ['mdui-bottom-app-bar'],
  'top-app-bar': ['mdui-top-app-bar', 'mdui-top-app-bar-title'],
  layout: ['mdui-layout', 'mdui-layout-item', 'mdui-layout-main'],
};

// vscode 和 webstorm 中的 description 如果包含链接，默认是不包含域名的，这里手动添加域名
export const handleDescription = (
  description: string,
  language: I18nLanguage,
) => {
  return (description || '').replaceAll(
    '](/docs/2/',
    `](${docOrigin}/${language}/docs/2/`,
  );
};

// 根据 tagName 获取 pageName
const getPageNameByTagName = (tagName: string): string => {
  return Object.keys(docComponents).find((pageName) =>
    docComponents[pageName].includes(tagName),
  )!;
};

// 根据 tagName 获取文档页面url
export const getDocUrlByTagName = (
  tagName: string,
  language: I18nLanguage,
): string => {
  const pageName = getPageNameByTagName(tagName);

  return `${docOrigin}/${language}/docs/2/components/${pageName}`;
};

// 判断文档页面是否含有多个组件（如 radio 文档页有 mdui-radio 和 mdui-radio-group 两个组件）
export const isDocHasMultipleComponents = (tagName: string) => {
  const pageName = getPageNameByTagName(tagName);

  return docComponents[pageName].length > 1;
};
