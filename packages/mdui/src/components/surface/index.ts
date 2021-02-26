import { LitElement, html, customElement } from 'lit-element';
import ElevationMixin from '../../mixins/elevation.js';
// @ts-ignore
import style from './style.js';

@customElement('mdui-surface')
class MduiSurface extends ElevationMixin(LitElement) {
  static styles = style;

  render() {
    return html` <div>
      <slot></slot>
    </div>`;
  }
}

export default MduiSurface;
