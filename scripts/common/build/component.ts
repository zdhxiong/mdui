import fs from 'node:fs';

import {
  Package,
  ClassMethod,
  CustomElementDeclaration,
  CustomElementField,
} from 'custom-elements-manifest';

export type Component = Omit<
  CustomElementDeclaration,
  'tagName' | 'members'
> & {
  tagName: string;
  members: (CustomElementField | ClassMethod)[];
  path: string;
};

/**
 * 判断一个属性是否是 attribute 属性
 */
export const isAttribute = (
  member: Component['members'][number],
): member is CustomElementField => {
  return member.kind === 'field' && !!member.attribute;
};

/**
 * 判断一个属性是否是 property 属性
 */
export const isProperty = (
  member: Component['members'][number],
): member is CustomElementField => {
  return member.kind === 'field';
};

/**
 * 判断一个属性是否是方法
 */
export const isMethod = (
  member: Component['members'][number],
): member is ClassMethod => {
  return member.kind === 'method';
};

/**
 * 从 custom-elements.json 文件中提取出组件信息
 * @param metadataPath custom-elements.json 文件的路径
 */
export const getAllComponents = (metadataPath: string): Component[] => {
  const metadata: Package = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const components: Component[] = [];

  metadata.modules.forEach((module) => {
    const declarations = (module.declarations ??
      []) as CustomElementDeclaration[];

    declarations.forEach((component) => {
      // 仅处理自定义元素
      // 仅从 member 中仅提取 public 属性和方法
      // 其中包含了属性和方法，使用时可通过 member.kind === 'field' 过滤出属性，通过 member.kind === 'method' 过滤出方法
      // 其中属性包含了 attribute 和 property 属性，在使用时可通过 attribute 属性是否存在，判断是否存在 attribute 属性
      if (component.customElement) {
        component.members = (component.members ?? []).filter(
          (member) => member.privacy === 'public',
        );

        components.push(
          Object.assign(
            component,
            { tagName: component.tagName! },
            { members: component.members },
            { path: module.path },
          ),
        );
      }
    });
  });

  return components;
};
