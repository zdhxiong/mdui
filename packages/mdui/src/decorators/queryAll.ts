import { queryDecorator } from './utils.js';

export default function queryAll(selector: string, isReturnNative?: boolean) {
  return queryDecorator(selector, isReturnNative, true, false);
}
