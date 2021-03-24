import JQ from '../src/index';
import { JQStatic } from '../src/interfaces/JQStatic';

// @ts-ignore
const $ = typeof jQuery !== 'undefined' ? jQuery : JQ;

export default $ as JQStatic;
