import { JQStatic } from 'mdui.jq/es/interfaces/JQStatic';

export interface MduiStatic {
  /**
   * mdui.jq
   */
  $: JQStatic;

  // mdui 命名空间下的静态方法
  [method: string]: any;
}
