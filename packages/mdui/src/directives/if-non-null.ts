import { ifDefined } from 'lit-html/directives/if-defined';

export default (value: any) => ifDefined(value ?? undefined);
