import {
  html,
  LitElement,
  type CSSResultGroup,
  type TemplateResult,
} from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { when } from 'lit/directives/when.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/removeAttr.js';
import { toBooleanString } from '@mdui/jq/shared/helper.js';
import { AccessibleMixin } from '../../mixins/accessible.js';
import { style } from './style.js';

export class IconElement extends AccessibleMixin(LitElement) {
  public static override styles: CSSResultGroup = style;

  protected svg(svgPaths: string): TemplateResult {
    const hasAccessible = this._accessibleLabel || this._accessibleDescription;

    return html`<svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="currentColor"
        role=${ifDefined(hasAccessible ? 'img' : undefined)}
        aria-label=${ifDefined(this._accessibleLabel)}
        aria-describedby=${ifDefined(
          this._accessibleDescription ? 'describedby' : undefined,
        )}
        aria-hidden=${toBooleanString(!hasAccessible)}
      >
        ${unsafeSVG(svgPaths)}
      </svg>
      ${when(
        this._accessibleDescription,
        () =>
          html`<div style="display: none" id="describedby">
            ${this._accessibleDescription}
          </div>`,
      )}`;
  }
}
