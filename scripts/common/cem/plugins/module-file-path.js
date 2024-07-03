/**
 * 替换 custom-elements.json 中的模块路径
 * @param {string} pkgName 当前包名
 * @return {import('@custom-elements-manifest/analyzer').Plugin}
 */
export const moduleFilePathPlugin = (pkgName) => {
  const replacePath = (path) => {
    return path
      ?.replace?.(new RegExp('^(?:/)?packages/' + pkgName + '/src/'), '') // 当前包，移除前缀
      ?.replace?.(/^\/?packages\/([^/]+)\/src\//, '@mdui/$1/') // 其他包，改为以 @mdui/ 开头的前缀
      ?.replace?.(/\.ts$/, '.js'); // 后缀改为 .js
  };

  return {
    name: 'module-file-path',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest?.modules.forEach((module) => {
        module.path = replacePath(module.path);

        for (const ex of module.exports ?? []) {
          ex.declaration.module = replacePath(ex.declaration.module);
        }

        for (const dec of module.declarations ?? []) {
          if (dec.kind === 'class') {
            ['members', 'attributes', 'events'].forEach((key) => {
              for (const member of dec[key] ?? []) {
                if (member.inheritedFrom)
                  member.inheritedFrom.module = replacePath(
                    member.inheritedFrom.module,
                  );
              }
            });

            for (const mixin of dec.mixins ?? []) {
              mixin.module = replacePath(mixin.module);
            }

            if (dec.superclass) {
              dec.superclass.module = replacePath(dec.superclass.module);
            }
          }
        }
      });
    },
  };
};
