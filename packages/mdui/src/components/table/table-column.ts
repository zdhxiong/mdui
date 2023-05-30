import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tableColumnStyle } from './table-column-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 自定义列的内容
 * @slot header - 自定义表头的内容
 */
@customElement('mdui-table-column')
export class TableColumn extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    tableColumnStyle,
  ];

  /**
   * 列的字段名
   */
  @property({ reflect: true })
  public prop!: string;

  /**
   * 列的标题
   */
  @property({ reflect: true })
  public label!: string;

  /**
   * 列的对齐方式
   */
  @property({ reflect: true })
  public align: 'left' /*左对齐*/ | 'center' /*居中对齐*/ | 'right' /*右对齐*/ =
    'left';

  /**
   * 列的类型。可选值为：
   * * `selection`
   * * `index`
   */
  @property({ reflect: true })
  public type!:
    | 'selection' /*显示多选框*/
    | 'index' /*显示改行的索引（从 1 开始计算）*/;

  protected override render(): TemplateResult {
    return html``;
  }
}
