function sortBy(propertyName, desc = false) {
  return (a, b) => {
    return desc === false
      ? a[propertyName].localeCompare(b[propertyName])
      : b[propertyName].localeCompare(a[propertyName]);
  };
}

/**
 * custom-elements.json 中的模块按字母顺序排序
 * @returns {import('@custom-elements-manifest/analyzer').Plugin}
 */
export default function sortItems() {
  return {
    name: 'sort-items',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest?.modules?.sort(sortBy('path'));

      for (const module of customElementsManifest?.modules) {
        for (const declaration of module?.declarations) {
          declaration.attributes?.sort(sortBy('name'));
          declaration.cssParts?.sort(sortBy('name'));
          declaration.cssProperties?.sort(sortBy('name'));
          declaration.events?.sort(sortBy('name'));
          declaration.members?.sort(sortBy('name'));
          declaration.slots?.sort(sortBy('name'));
        }
      }
    },
  };
}
