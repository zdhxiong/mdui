import Selector from 'mdui.jq/es/types/Selector';
import mdui from '../../mdui';
import { CollapseAbstract, OPTIONS } from '../collapse/collapseAbstract';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 可扩展面板组件
     *
     * 请通过 `new mdui.Panel()` 调用
     */
    Panel: {
      /**
       * 实例化 Panel 组件
       * @param selector CSS 选择器或 DOM 元素
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Panel;
    };
  }
}

class Panel extends CollapseAbstract {
  protected getNamespace(): string {
    return 'panel';
  }
}

mdui.Panel = Panel;
