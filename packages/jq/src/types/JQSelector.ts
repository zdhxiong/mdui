import Selector from './Selector';
import HTMLString from './HTMLString';
import { JQ } from '../JQ';

/**
 * $() 函数允许传入的参数类型
 */
type JQSelector =
  | Selector
  | HTMLString
  | Window
  | JQ
  | Node
  | ArrayLike<Node | Window | null | undefined>
  | NodeList
  | null
  | undefined;

export default JQSelector;
