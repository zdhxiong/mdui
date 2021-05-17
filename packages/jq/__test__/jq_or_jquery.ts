import jq from '../index';
import { JQStatic } from '../shared/core';

// @ts-ignore
const $ = typeof jQuery !== 'undefined' ? jQuery : jq;

// eslint-disable-next-line import/no-default-export
export default $ as JQStatic;
