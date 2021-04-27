import { LitElement, html, TemplateResult } from 'lit';
import { customElement } from '@mdui/shared/decorators.js';
import { ElevationMixin } from '@mdui/shared/mixins.js';
import { style } from './style.js';

@customElement('mdui-surface')
export class MduiSurface extends ElevationMixin(LitElement) {
  static styles = style;

  render(): TemplateResult {
    return html`<div class="surface">
      <slot></slot>
    </div>`;
  }
}
