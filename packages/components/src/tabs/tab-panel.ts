import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tabPanelStyle } from './tab-panel-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 选项卡面板内容
 */
@customElement('mdui-tab-panel')
export class TabPanel extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    tabPanelStyle,
  ];

  /**
   * 该选项卡面板的值
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 是否为激活状态，由 `<mdui-tabs>` 组件控制该状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  protected active = false;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tab-panel': TabPanel;
  }
}
