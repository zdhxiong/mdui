import JQ from '../src/index';
import { JQStatic } from '../src/interfaces/JQStatic';

const $ = typeof jQuery !== 'undefined' ? jQuery : JQ;

export default $ as JQStatic;
