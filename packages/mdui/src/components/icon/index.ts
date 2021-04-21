import { customElement, html, LitElement } from 'lit-element';
// @ts-ignore
import style from './style.js';

@customElement('mdui-icon')
class MduiIcon extends LitElement {
  static styles = style;

  render() {
    return html`<slot></slot>`;
  }
}

export default MduiIcon;
