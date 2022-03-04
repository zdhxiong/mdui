import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { when } from 'lit/directives/when.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

/**
 * @slot - 文本
 *
 * @csspart control - 选择框
 * @csspart label - 文本
 */
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

  private readonly hasSlotController = new HasSlotController(this, '[default]');

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
    const hasLabel = this.hasSlotController.test('[default]');

    return html`<label>
      <input
        type="checkbox"
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
      />
      <i part="control">
        <mdui-ripple></mdui-ripple>
      </i>
      ${when(hasLabel, () => html`<span part="label"><slot></slot></span>`)}
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-checkbox': Checkbox;
  }
}
