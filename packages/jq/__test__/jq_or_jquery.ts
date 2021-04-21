import jq from '../es/index';
import { JQStatic } from '../es/shared/core';

// @ts-ignore
const $ = typeof jQuery !== 'undefined' ? jQuery : jq;

export default $ as JQStatic;
