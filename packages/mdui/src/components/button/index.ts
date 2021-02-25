import {
  html,
  css,
  property,
  customElement,
  CSSResultArray,
  LitElement,
} from 'lit-element';
import ElevationMixin from '../../mixins/elevation.js';

const innerTemplate = html`
  <slot name="icon"></slot>
  <slot></slot>
`;

@customElement('mdui-button')
class MduiButton extends ElevationMixin(LitElement) {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          --mdui-button-min-width: 64px;
          --mdui-button-height: 36px;
          --mdui-button-border-radius: 4px;

          display: inline-block;
          font-weight: medium;
          text-align: center;
          text-transform: uppercase;
          width: auto;
          height: var(--mdui-button-height, 36px);
          min-width: var(--mdui-button-min-width, 64px);
          color: var(--mdui-theme-primary, #6200ee);
          font-size: var(--mdui-typography-button-font-size, 14px);
          letter-spacing: var(--mdui-typography-button-letter-spacing, 1.25);
          border-radius: var(--mdui-button-border-radius, 4px);
        }

        :host([fullwidth]) {
          width: 100%;
        }

        button,
        a {
          width: 100%;
          height: 100%;
          text-align: inherit;
          text-transform: inherit;
          position: relative;
          box-sizing: border-box;
          /* padding 根据按钮类型区分 */
          overflow: hidden;
          white-space: nowrap;
          text-decoration: none;
          vertical-align: middle;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          /* transition: all .2s @animation-curve-default,
              box-shadow .2s @animation-curve-fast-out-linear-in; */
          user-select: none;
          touch-action: manipulation;
          will-change: box-shadow;
          zoom: 1;
          -webkit-user-drag: none;
        }
      `,
    ];
  }

  @property({ type: Boolean, reflect: true })
  outlined = false;

  @property({ type: Boolean, reflect: true })
  raised = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  fullwidth = false;

  @property({ type: String, reflect: true })
  href = '';

  render() {
    return html`
      ${this.href
        ? html`<a href="${this.href}">${innerTemplate}</a>`
        : html`<button>${innerTemplate}</button>`}
    `;
  }
}

export default MduiButton;
