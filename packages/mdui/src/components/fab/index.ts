import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { delay } from '@mdui/shared/helpers/delay.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 浮动操作按钮组件
 *
 * ```html
 * <mdui-fab icon="edit"></mdui-fab>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 右侧的文本
 * @csspart icon - 左侧的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner-small - `size="small"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-normal - `size="normal"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-large - `size="large"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-fab')
export class Fab extends ButtonBase<FabEventMap> {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * FAB 的形状，此组件的不同形状之间只有颜色不一样。可选值包括：
   *
   * * `primary`：使用 Primary container 背景色
   * * `surface`：使用 Surface container high 背景色
   * * `secondary`：使用 Secondary container 背景色
   * * `tertiary`：使用 Tertiary container 背景色
   */
  @property({ reflect: true })
  public variant:
    | /*使用 Primary container 背景色*/ 'primary'
    | /*使用 Surface container high 背景色*/ 'surface'
    | /*使用 Secondary container 背景色*/ 'secondary'
    | /*使用 Tertiary container 背景色*/ 'tertiary' = 'primary';

  /**
   * FAB 的大小。可选值包括：
   * * `normal`：普通大小 FAB
   * * `small`：小型 FAB
   * * `large`：大型 FAB
   */
  @property({ reflect: true })
  public size:
    | /*普通大小 FAB*/ 'normal'
    | /*小型 FAB*/ 'small'
    | /*大型 FAB*/ 'large' = 'normal';

  /**
   * Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 是否为展开状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public extended = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(this, 'icon');
  private readonly definedController = new DefinedController(this, {
    relatedElements: [''],
  });

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  /**
   * extended 变更时，设置动画
   */
  @watch('extended')
  private async onExtendedChange() {
    const hasUpdated = this.hasUpdated;

    if (this.extended) {
      this.style.width = `${this.scrollWidth}px`;
    } else {
      this.style.width = '';
    }

    await this.definedController.whenDefined();
    await this.updateComplete;

    if (this.extended && !hasUpdated) {
      this.style.width = `${this.scrollWidth}px`;
    }

    if (!hasUpdated) {
      // 延迟设置动画，避免首次渲染时也执行动画
      await delay();
      this.style.transitionProperty = 'box-shadow, width, bottom, transform'; // bottom, transform 在 bottom-app-bar 中用到
    }
  }

  protected override render(): TemplateResult {
    const className = cc({
      button: true,
      'has-icon': this.icon || this.hasSlotController.test('icon'),
    });

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className,
            part: 'button',
            content: this.renderInner(),
          })
        : this.disabled || this.loading
          ? html`<span part="button" class="_a ${className}">
              ${this.renderInner()}
            </span>`
          : this.renderAnchor({
              className,
              part: 'button',
              content: this.renderInner(),
            })}`;
  }

  private renderLabel(): TemplateResult {
    return html`<slot part="label" class="label"></slot>`;
  }

  private renderIcon(): TemplateResult {
    if (this.loading) {
      return this.renderLoading();
    }

    return html`<slot name="icon" part="icon" class="icon">
      ${this.icon
        ? html`<mdui-icon name=${this.icon}></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderInner(): TemplateResult[] {
    return [this.renderIcon(), this.renderLabel()];
  }
}

export interface FabEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-fab': Fab;
  }
}
