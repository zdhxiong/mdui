import {
  DynamicScheme,
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  TonalPalette,
  hexFromArgb,
} from '@material/material-color-utilities';
import { EMaterialContrastLevel, TMaterialContrastLevel } from './contrast.js';
import { MaterialColors, TMaterialColors } from './materialColors.js';
import { EMaterialVariant, TMaterialVariant } from './variant.js';

/**
 * @param sourceColorArgb 主题的源颜色, ARGB32位整数.
 * @param variant 主题的变体或样式.
 * @param contrastLevel 从-1到1的值. -1代表最小对比度, 0代表标准(即按规格设计), 1代表最大对比.
 * @param isDark 该方案是否处于深色模式或浅色模式.
 * @param PrimaryPalette 给定一个色调, 产生一种颜色. 色调和彩度颜色在变体的设计规范中指定. 通常丰富多彩.
 * @param secondaryPalette 给定一个色调,产生一种颜色. 色相和彩度颜色在变体的设计规范中指定. 通常色彩较少.
 * @param tertiaryPalette 给定一个色调,产生一种颜色. 色相和彩度颜色在变体的设计规范中指定. 通常与原色和彩色不同的色调.
 * @param neutralPalette 给定一个色调,产生一种颜色. 色调和彩度颜色在变体的设计规范中指定. 通常不会色彩丰富,适用于背景和表面颜色.
 * @param neutralVariantPalette 给定一个色调,产生一种颜色. 色相和色度颜色在变体的设计规范中指定. 通常不是彩色的,但比中性色稍微鲜艳一些. 适用于背景和表面.
 */
export type TMaterialDynamicSchemeOptions = {
  sourceColorArgb: number;
  isDark: boolean;
  contrastLevel: number | TMaterialContrastLevel;
  primaryPalette: number;
  secondaryPalette: number;
  tertiaryPalette: number;
  neutralPalette: number;
  neutralVariantPalette: number;
  variant: TMaterialVariant;
};

/**
 * @param contrastLevel 从-1到1的值. -1代表最小对比度, 0代表标准(即按规格设计), 1代表最大对比.
 * @param isDark 该方案是否处于深色模式或浅色模式.
 */
export type TMaterialDynamicSchemeUsingVariantOptions = Pick<
  TMaterialDynamicSchemeOptions,
  'isDark'
> &
  Pick<TMaterialDynamicSchemeOptions, 'contrastLevel'>;

/**
 * @param prefix 转换到样式文本时的前缀.
 */
export type TStylizableOptions = {
  prefix: string;
};

/**
 * 生成MDUI设计令牌的方案.
 *
 * @example
 * 生成设计令牌并将设计令牌转换为字符串输出到控制台:
 * ```javascript
 * const tokens = GenerateMaterialDynamicScheme.generateUsingTonalSpot(0x0123331)
 * const styleText = GenerateMaterialDynamicScheme.toStyleText(tokens)
 * console.log(tokens, styleText);
 *```
 */
export class GenerateMaterialDynamicScheme {
  /**
   * 灰度动态颜色主题
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingMonochrome(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Monochrome,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 接近灰度的动态颜色主题.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingNeutral(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Neutral,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 具有低到中等色彩度和第三级的动态颜色主题.
   * TonalPalette 具有与源颜色相关的色调. Android 12 和 13 上的默认 Material You 主题.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingTonalSpot(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.TonalSpot,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 动态色彩主题，可最大限度地发挥画面中每个位置的色彩. 主要色调调色板.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingVibrant(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Vibrant,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 有意与源颜色分离的动态颜色主题.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingExpressive(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Expressive,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 将源颜色放置在"Scheme.primaryContainer"中的方案.
   * 主容器是源颜色，根据颜色相关性进行调整.
   * 在浅色模式和深色模式下保持恒定的外观.
   * 这会在浅色模式下增加 ~5 色调，并在深色模式下减少 ~5 色调.
   * 第三级容器是对源颜色的补充，使用温度缓存.
   * 它还保持恒定的外观.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingFidelity(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Fidelity,
      sourceColorArgb,
      options,
    );
  }
  /**
   * 将源颜色放置在"Scheme.primaryContainer"中的方案。
   * 主容器是源颜色，根据颜色相关性进行调整.
   * 在浅色模式和深色模式下保持恒定的外观.
   * 这会在浅色模式下增加 ~5 色调，并在深色模式下减少 ~5 色调.
   * 第三级容器是对源颜色的补充，使用温度缓存.
   * 它还保持恒定的外观.
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingContent(
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    return this.generateUsingVariant(
      EMaterialVariant.Content,
      sourceColorArgb,
      options,
    );
  }

  /**
   * 由一组表示当前UI状态的值构成（例如是否是深色主题，主题风格是什么等等, 以及
   * 提供了一组 TonalPalettes，可以创建适合的颜色与主题风格.
   * 由DynamicColor用于解析为颜色.
   * @param options
   * @returns TMaterialColors类型的设计令牌对象
   */
  public static generateUsingPalette(
    options?: Partial<TMaterialDynamicSchemeOptions>,
  ) {
    /**
     * DynamicScheme方法中的variant选项的enum未被material-color-utilities导出.
     * 请保持variant标注为[ts-ignore].
     */
    const scheme = new DynamicScheme({
      sourceColorArgb: options?.sourceColorArgb ?? 0xffeb0057,
      // @ts-ignore
      variant: options?.variant ?? EMaterialVariant.Vibrant,
      isDark: options?.isDark ?? false,
      contrastLevel: options?.contrastLevel ?? EMaterialContrastLevel.Default,
      primaryPalette: TonalPalette.fromInt(
        options?.primaryPalette ?? 0xffeb0057,
      ),
      secondaryPalette: TonalPalette.fromInt(
        options?.secondaryPalette ?? 0xfff46b00,
      ),
      tertiaryPalette: TonalPalette.fromInt(
        options?.tertiaryPalette ?? 0xff00ab46,
      ),
      neutralPalette: TonalPalette.fromInt(
        options?.neutralPalette ?? 0xff949494,
      ),
      neutralVariantPalette: TonalPalette.fromInt(
        options?.neutralVariantPalette ?? 0xffbc8877,
      ),
    });

    const theme: Record<string, string> = {};
    for (const [key, value] of Object.entries(MaterialColors)) {
      theme[key] = hexFromArgb(value.getArgb(scheme));
    }

    return theme as TMaterialColors;
  }

  public static toStyleText(
    theme: TMaterialColors,
    options?: Partial<TStylizableOptions>,
  ) {
    return Object.entries(theme)
      .map(
        (e) =>
          `--${options?.prefix ? this.toKebabCase(options.prefix) : 'mdui-color'}-${this.toKebabCase(e[0])}: ${e[1]};`,
      )
      .reduce((l, c) => l + c);
  }

  /**
   * 将输入的字符串以kebab-case的格式输出, 无副作用.
   * @param str 需要转换到kebab-case格式的字符串
   * @returns kebab-case的格式的字符串
   * @example
   * ```javascript
   * // abcd-e-f-1-2
   * this.toKebabCase('AbcdEF12')
   * ```
   */
  private static toKebabCase(str: string) {
    return str
      .split('')
      .map((letter, idx) => {
        return letter.toUpperCase() === letter
          ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
          : letter;
      })
      .join('');
  }

  /**
   * @param generateMethod TMaterialVariant类型的枚举值:
   * Monochrome = 0
   * Neutral = 1
   * TonalSpot = 2
   * Vibrant = 3
   * Expressive = 4
   * Fidelity = 5
   * Content = 6
   * @param sourceColorArgb ARGB32位整数
   * @param options 可选项
   * @param options.isDark 深色模式
   * @param options.contrastLevel 对比度
   */
  private static generateUsingVariant(
    generateMethod: TMaterialVariant,
    sourceColorArgb: number,
    options?: Partial<TMaterialDynamicSchemeUsingVariantOptions>,
  ) {
    let scheme = null;
    switch (generateMethod) {
      case 0:
        scheme = new SchemeMonochrome(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 1:
        scheme = new SchemeNeutral(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 2:
        scheme = new SchemeTonalSpot(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 3:
        scheme = new SchemeVibrant(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 4:
        scheme = new SchemeExpressive(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 5:
        scheme = new SchemeFidelity(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      case 6:
        scheme = new SchemeContent(
          Hct.fromInt(sourceColorArgb),
          options?.isDark ?? false,
          options?.contrastLevel ?? EMaterialContrastLevel.Default,
        );
        break;
      default:
        throw new Error(`不被允许的参数[generateMethod][${generateMethod}]`);
    }
    const theme: Record<string, string> = {};
    for (const [key, value] of Object.entries(MaterialColors)) {
      theme[key] = hexFromArgb(value.getArgb(scheme));
    }
    return theme as TMaterialColors;
  }
}
