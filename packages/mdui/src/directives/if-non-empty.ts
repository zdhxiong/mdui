import { ifDefined } from 'lit-html/directives/if-defined';

export default (value: string) =>
  ifDefined(value === '' ? undefined : value ?? undefined);
