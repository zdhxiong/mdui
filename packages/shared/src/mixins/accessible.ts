import { property, state } from 'lit/decorators.js';
import { DefinedController } from '../controllers/defined.js';
import { watch } from '../decorators/watch.js';
import {
  deregisterAccessibility,
  registerAccessibility,
  getAccessibleLabelRefTexts,
  getAccessibleDescriptionRefTexts,
  onAccessiblePropertyChange,
  type AccessibleProperties,
} from '../helpers/accessibility.js';
import type { Constructor } from '@lit/reactive-element/decorators/base.js';
import type { LitElement } from 'lit';

export declare class AccessibleMixinInterface implements AccessibleProperties {
  public accessibleLabel?: string;
  public accessibleLabelledby?: string;
  public accessibleDescription?: string;
  public accessibleDescribedby?: string;
  protected _accessibleLabel?: string;
  protected _accessibleDescription?: string;
  protected onAccessiblePropertyChange(): void;
}

export const AccessibleMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<AccessibleMixinInterface> & T => {
  class AccessibleMixinClass extends superclass {
    /**
     * 组件的无障碍名称。它将应用到 [`aria-label`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label)，但不会在界面上显示
     */
    @property({ reflect: true, attribute: 'accessible-label' })
    public accessibleLabel?: string;

    /**
     * 页面中其他元素的 id（或多个 id），组件将使用对应元素的文本作为无障碍名称。等同于 [`aria-labelledby`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby)
     */
    @property({ reflect: true, attribute: 'accessible-labelledby' })
    public accessibleLabelledby?: string;

    /**
     * 组件的无障碍描述。它将应用到 [`aria-description`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-description)，但不会在界面上显示
     * TODO: aria-description 位于 WAI-ARIA 1.3 规范中，尚未正式发布。目前采用添加隐藏元素，并通过 aria-describedby 指向隐藏元素
     */
    @property({ reflect: true, attribute: 'accessible-description' })
    public accessibleDescription?: string;

    /**
     * 页面中其他元素的 id（或多个 id），组件将使用对应元素的文本作为无障碍描述。等同于 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)
     */
    @property({ reflect: true, attribute: 'accessible-describedby' })
    public accessibleDescribedby?: string;

    /**
     * accessibleLabelledby 引用的所有元素的文本
     */
    @state()
    private _accessibleLabelRefTexts?: string;

    /**
     * accessibleDescribedby 引用的所有元素的文本
     */
    @state()
    private _accessibleDescriptionRefTexts?: string;

    protected accessibleDefinedController: DefinedController =
      new DefinedController(this, { needDomReady: true });

    /**
     * 合并 accessibleLabel 和 accessibleLabelledby 后的 aria-label 文本
     */
    protected get _accessibleLabel(): string | undefined {
      return this._accessibleLabelRefTexts || this.accessibleLabel || undefined;
    }

    /**
     * 合并 accessibleDescription 和 accessibleDescribedby 后的 aria-description 文本
     */
    protected get _accessibleDescription(): string | undefined {
      return (
        this._accessibleDescriptionRefTexts ||
        this.accessibleDescription ||
        undefined
      );
    }

    @watch('accessibleLabelledby', true)
    @watch('accessibleDescribedby', true)
    private async onAccessibleRefPropertyChange() {
      await this.accessibleDefinedController.whenDefined();

      onAccessiblePropertyChange(this);
    }

    @watch('accessibleLabel', true)
    @watch('accessibleDescription', true)
    private onAccessibleTextPropertyChange() {
      this.onAccessiblePropertyChange();
    }

    public override connectedCallback(): void {
      super.connectedCallback();

      this.accessibleDefinedController.whenDefined().then(() => {
        registerAccessibility(this, () => {
          this._accessibleLabelRefTexts = getAccessibleLabelRefTexts(this);
          this._accessibleDescriptionRefTexts =
            getAccessibleDescriptionRefTexts(this);

          this.onAccessiblePropertyChange();
        });
      });
    }

    public override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.accessibleDefinedController.whenDefined().then(() => {
        deregisterAccessibility(this);
      });
    }

    /**
     * 在 accessibleLabel、accessibleLabelledby、accessibleDescription、accessibleDescribedby 属性变更，且 完成后执行的函数。可在父类中定义该方法
     */
    protected onAccessiblePropertyChange(): void {}
  }

  return AccessibleMixinClass as unknown as Constructor<AccessibleMixinInterface> &
    T;
};
