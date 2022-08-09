import type { TemplateResult, CSSResultGroup } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { ajax } from '@mdui/jq/functions/ajax.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';

export type MaterialIconsName = string;

/**
 * @event click - 点击时触发
 */
@customElement('mdui-icon')
export class Icon extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  protected readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
  );

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
    const renderDefault = () => {
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

      return html``;
    };

    return this.hasSlotController.test('[default]')
      ? html`<slot></slot>`
      : renderDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-icon': Icon;
  }
}
