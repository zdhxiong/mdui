import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

@customElement('mdui-checkbox')
export class Checkbox extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @query('input', true)
  protected inputElement!: HTMLInputElement;

  protected get focusProxiedElements(): HTMLElement[] {
    return [this.inputElement];
  }

  @property({ type: Boolean, reflect: true })
  public disabled = false;

  @property({ type: Boolean, reflect: true })
  public checked = false;

  @property({ type: Boolean, reflect: true })
  public indeterminate = false;

  @property({ type: Boolean, reflect: true })
  public required = false;

  @property({ type: Boolean })
  public autofocus = false;

  @property({ reflect: true })
  public form!: string;

  @property({ reflect: true })
  public name!: string;

  @property({ reflect: true })
  public value = 'on';

  @watch('indeterminate')
  private async onIndeterminateChange() {
    await this.updateComplete;
    this.inputElement.indeterminate = this.indeterminate;
  }

  protected override render(): TemplateResult {
    const { disabled, checked, autofocus } = this;

    return html`<label>
      <input
        type="checkbox"
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
      />
      <i>
        <mdui-ripple></mdui-ripple>
      </i>
      <slot></slot>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-checkbox': Checkbox;
  }
}
