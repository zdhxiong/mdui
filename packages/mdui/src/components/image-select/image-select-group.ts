import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { isString } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { arraysEqualIgnoreOrder } from '@mdui/shared/helpers/array.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { imageSelectGroupStyle } from './image-select-group-style.js';
import type { ImageSelect as ImageSelectOriginal } from './index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type ImageSelect = ImageSelectOriginal & {
  selected: boolean;
  groupDisabled: boolean;
};

/**
 * @summary 图片选择组组件。需配合 `<mdui-image-select>` 组件使用
 *
 * ```html
 * <mdui-image-select-group selects="multiple">
 * ..<mdui-image-select src="image1.jpg" value="1"></mdui-image-select>
 * ..<mdui-image-select src="image2.jpg" value="2"></mdui-image-select>
 * ..<mdui-image-select src="image3.jpg" value="3"></mdui-image-select>
 * </mdui-image-select-group>
 * ```
 *
 * @event change - 选中的值变更时触发
 *
 * @slot - `<mdui-image-select>` 组件
 *
 * @cssprop --columns - 网格列数。默认为 `3`
 * @cssprop --gap - 网格间距。默认为 `0.5rem`
 */
@customElement('mdui-image-select-group')
export class ImageSelectGroup extends MduiElement<ImageSelectGroupEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    imageSelectGroupStyle,
  ];

  /**
   * 选择模式。可选值包括：
   *
   * * `single`：单选
   * * `multiple`：多选
   */
  @property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
  public selects:
    | /*单选*/ 'single'
    | /*多选*/ 'multiple' = 'multiple';

  /**
   * 是否为禁用状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 当前选中的 `<mdui-image-select>` 的值。
   *
   * 在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。
   */
  @property()
  public value: string | string[] = '';

  @state()
  private selectedValues: string[] = [];

  // 是否为初始状态，初始状态不触发 change 事件
  private isInitial = true;

  private readonly definedController = new DefinedController(this, {
    relatedElements: ['mdui-image-select'],
  });

  // 为了使 <mdui-image-select> 可以不是该组件的直接子元素
  private get items() {
    return $(this)
      .find('mdui-image-select')
      .get() as unknown as ImageSelect[];
  }

  private get itemsEnabled() {
    return $(this)
      .find('mdui-image-select:not([disabled])')
      .get() as unknown as ImageSelect[];
  }

  private get isSingle() {
    return this.selects === 'single';
  }

  private get isMultiple() {
    return this.selects === 'multiple';
  }

  @watch('selects', true)
  private async onSelectsChange() {
    if (this.isSingle && this.selectedValues.length > 1) {
      this.setSelectedValues(this.selectedValues.slice(0, 1));
    }

    await this.onSelectedValuesChange();
  }

  @watch('selectedValues', true)
  private async onSelectedValuesChange() {
    await this.definedController.whenDefined();

    const value = this.isMultiple
      ? this.selectedValues
      : this.selectedValues[0] || '';

    this.setValue(value);

    if (!this.isInitial) {
      this.emit('change');
    }
  }

  @watch('value')
  private async onValueChange() {
    this.isInitial = !this.hasUpdated;
    await this.definedController.whenDefined();

    const values = (
      this.isSingle
        ? [this.value as string]
        : isString(this.value)
          ? this.value
            ? [this.value]
            : []
          : this.value
    ).filter((i) => i);

    this.setSelectedValues(values);
    this.updateItems();
  }

  @watch('disabled')
  private async onDisabledChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }

  public override connectedCallback() {
    super.connectedCallback();

    this.value =
      this.isMultiple && isString(this.value)
        ? this.value
          ? [this.value]
          : []
        : this.value;
  }

  protected override render(): TemplateResult {
    return html`<slot
      @slotchange=${this.onSlotChange}
      @click=${this.onClick}
    ></slot>`;
  }

  private selectOne(item: ImageSelect) {
    if (this.isMultiple) {
      const values = [...this.selectedValues];
      if (values.includes(item.value)) {
        values.splice(values.indexOf(item.value), 1);
      } else {
        values.push(item.value);
      }
      this.setSelectedValues(values);
    }

    if (this.isSingle) {
      if (this.selectedValues.includes(item.value)) {
        this.setSelectedValues([]);
      } else {
        this.setSelectedValues([item.value]);
      }
    }

    this.isInitial = false;
    this.updateItems();
  }

  private async onClick(event: MouseEvent) {
    if (event.button) {
      return;
    }

    await this.definedController.whenDefined();

    const target = event.target as HTMLElement;
    const item = target.closest(
      'mdui-image-select',
    ) as ImageSelect | null;

    if (!item || item.disabled || item.groupDisabled) {
      return;
    }

    if (item.value) {
      this.selectOne(item);
    }
  }

  private async onSlotChange() {
    await this.definedController.whenDefined();
    this.updateItems();
  }

  private setSelectedValues(values: string[]): void {
    if (!arraysEqualIgnoreOrder(this.selectedValues, values)) {
      this.selectedValues = values;
    }
  }

  private setValue(value: string | string[]): void {
    if (this.isSingle) {
      this.value = value;
    } else if (
      !arraysEqualIgnoreOrder(this.value as string[], value as string[])
    ) {
      this.value = value;
    }
  }

  private updateItems() {
    this.items.forEach((item) => {
      item.groupDisabled = this.disabled;
      item.selected = this.selectedValues.includes(item.value);
    });
  }
}

export interface ImageSelectGroupEventMap {
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-image-select-group': ImageSelectGroup;
  }
}
