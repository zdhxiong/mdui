import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from '@mdui/shared/decorators/custom-element.js';
import { property } from '@mdui/shared/decorators/property.js';
import { styleMap } from '@mdui/shared/directives/style-map.js';
import { unsafeSVG } from '@mdui/shared/directives/unsafe-svg.js';
import { until } from '@mdui/shared/directives/until.js';
import { ajax } from '@mdui/jq/functions/ajax.js';
import { style } from './style.js';

@customElement('mdui-icon')
export class Icon extends LitElement {
  static override styles: CSSResultGroup = style;

  /**
   * Material Icons 图标名
   */
  @property()
  name = '';

  /**
   * Material Icons 的五种变体：outlined, filled, round, sharp, two-tone。默认为 filled。
   * 仅在设置了 name 属性时，该属性才有效
   */
  @property()
  variant: string | undefined;

  /**
   * svg 图标的路径
   */
  @property()
  src = '';

  /**
   * 根据 variant 属性获取 Material Icons 的 font-family 名称
   */
  private getFontFamily(): string | undefined {
    if (!this.variant) {
      return;
    }

    const familyMap = new Map([
      ['outlined', 'Material Icons Outlined'],
      ['filled', 'Material Icons'],
      ['round', 'Material Icons Round'],
      ['sharp', 'Material Icons Sharp'],
      ['two-tone', 'Material Icons Two Tone'],
    ]);

    return familyMap.get(this.variant);
  }

  protected override render(): TemplateResult {
    if (this.name) {
      return html`<span style=${styleMap({ fontFamily: this.getFontFamily() })}
        >${this.name}</span
      >`;
    }

    if (this.src) {
      return html`${until(ajax({ url: this.src }).then(unsafeSVG))}`;
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-icon': Icon;
  }
}
