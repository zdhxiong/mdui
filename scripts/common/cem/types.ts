import { Plugin } from '@custom-elements-manifest/analyzer';

/**
 * @see https://custom-elements-manifest.open-wc.org/analyzer/config/
 */
export interface userConfigOptions {
  globs?: string[];
  exclude?: string[];
  outdir?: string;
  dev?: boolean;
  watch?: boolean;
  dependencies?: boolean;
  packagejson?: boolean;

  litelement?: boolean;
  catalyst?: boolean;
  fast?: boolean;
  stencil?: boolean;

  plugins?: Array<Plugin>;
}
