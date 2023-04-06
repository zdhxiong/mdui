/**
 * 在原生的 HTML 中，布尔属性只要添加了属性名，不论属性值设置成什么，属性值都是 true
 * 但这里设置了 attr="false" 时，要把属性设置为 false
 *
 * 原因是：
 * 在 vue3 中，通过 :attr="value" 设置属性时，vue 会优先从 DOM 属性中寻找是否存在 attr 属性名，
 * 若存在，则设置对应的 DOM 属性，否则设置对应的 attribute 属性
 * 但在 vue 的服务端渲染（ssr）时，不存在 DOM 对象，所以会把 attribute 属性设置成 attr="true" 或 attr="false"
 * 所以在 attribute 属性 attr="false" 时，需要把属性值转换为布尔值 false
 *
 * 这段代码不能封装成函数，否则生成 custom-elements.json 会识别不了
 * 这段注释仅在这里写一次，其他地方不再重复
 *
 * @see https://v3-migration.vuejs.org/zh/breaking-changes/attribute-coercion.html
 */
export const booleanConverter = (value: string | null): boolean => {
  return value !== null && value !== 'false';
};
