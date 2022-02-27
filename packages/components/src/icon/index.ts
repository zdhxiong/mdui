import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { ajax } from '@mdui/jq/functions/ajax.js';
import { style } from './style.js';

export type MaterialIconsName = string;

@customElement('mdui-icon')
export class Icon extends LitElement {
  static override styles: CSSResultGroup = style;

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public name!: MaterialIconsName;

  /**
   * svg 图标的路径
   */
  @property({ reflect: true })
  public src!: string;

  protected override render(): TemplateResult {
    if (this.name) {
      const [name, variant] = this.name.split('--');
      const familyMap = new Map([
        ['outlined', 'Material Icons Outlined'],
        ['filled', 'Material Icons'],
        ['round', 'Material Icons Round'],
        ['sharp', 'Material Icons Sharp'],
        ['two-tone', 'Material Icons Two Tone'],
      ]);

      return html`<span
        style=${styleMap({ fontFamily: familyMap.get(variant) })}
      >
        ${name}
      </span>`;
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
