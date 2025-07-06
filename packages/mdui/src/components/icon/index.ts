import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { when } from 'lit/directives/when.js';
import { ajax } from '@mdui/jq/functions/ajax.js';
import { toBooleanString } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AccessibleMixin } from '@mdui/shared/mixins/accessible.js';
import { style } from './style.js';
import type { TemplateResult, CSSResultGroup } from 'lit';

/**
 * @summary 图标组件
 *
 * ```html
 * <mdui-icon name="search"></mdui-icon>
 * ```
 *
 * @slot - `svg` 图标的内容
 */
@customElement('mdui-icon')
export class Icon extends AccessibleMixin(MduiElement)<IconEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public name?: string;

  /**
   * svg 图标的路径
   */
  @property({ reflect: true })
  public src?: string;

  private readonly hasSlotController = new HasSlotController(this, '[default]');

  protected override render(): TemplateResult {
    const renderDefault = () => {
      if (this.name) {
        const [name, variant] = this.name.split('--');
        const familyMap = new Map([
          ['outlined', 'Material Icons Outlined'],
          ['filled', 'Material Icons'],
          ['rounded', 'Material Icons Round'],
          ['sharp', 'Material Icons Sharp'],
          ['two-tone', 'Material Icons Two Tone'],
        ]);

        return html`<span
          translate="no"
          style=${styleMap({ fontFamily: familyMap.get(variant) })}
          aria-hidden="true"
        >
          ${name}
        </span>`;
      }

      if (this.src) {
        return html`<span style="display: contents" aria-hidden="true">
          ${until(ajax({ url: this.src }).then(unsafeSVG))}
        </span>`;
      }

      return html``;
    };

    const hasAccessible = this._accessibleLabel || this._accessibleDescription;

    return html`<div
        class="base"
        role=${ifDefined(hasAccessible ? 'img' : undefined)}
        aria-label=${ifDefined(this._accessibleLabel)}
        aria-describedby=${ifDefined(
          this._accessibleDescription ? 'describedby' : undefined,
        )}
        aria-hidden=${toBooleanString(!hasAccessible)}
      >
        ${this.hasSlotController.test('[default]')
          ? html`<slot aria-hidden="true"></slot>`
          : renderDefault()}
      </div>
      ${when(
        this._accessibleDescription,
        () =>
          html`<div style="display: none" id="describedby">
            ${this._accessibleDescription}
          </div>`,
      )}`;
  }
}

export interface IconEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-icon': Icon;
  }
}
