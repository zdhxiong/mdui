import { queryDecorator } from './utils.js';

export default function query(selector: string, isReturnNative?: boolean) {
  return queryDecorator(selector, isReturnNative, false, false);
}
