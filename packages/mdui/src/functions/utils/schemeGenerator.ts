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
export type TMaterialDynamicSchemeUsingVariantOptions = Pick<
  TMaterialDynamicSchemeOptions,
  'isDark'
> &
  Pick<TMaterialDynamicSchemeOptions, 'contrastLevel'>;

export type TStylizableOptions = {
  prefix: string;
};

export class GenerateMaterialDynamicScheme {
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
          `--${options?.prefix ?? 'mdui-color'}-${this.toKebabCase(e[0])}: ${e[1]};`,
      )
      .reduce((l, c) => l + c);
  }

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
   * Monochrome = 0,
   * Neutral = 1,
   * TonalSpot = 2,
   * Vibrant = 3,
   * Expressive = 4,
   * Fidelity = 5,
   * Content = 6,
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
