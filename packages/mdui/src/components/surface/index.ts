import { LitElement, html, customElement, CSSResultArray } from 'lit-element';
import ElevationMixin from '../../mixins/elevation.js';
// @ts-ignore
import style from './style.js';

@customElement('mdui-surface')
class MduiSurface extends ElevationMixin(LitElement) {
  static get styles(): CSSResultArray {
    return [style];
  }

  render() {
    return html`<slot></slot>`;
  }
}

export default MduiSurface;
