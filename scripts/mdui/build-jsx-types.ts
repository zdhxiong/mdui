import path from 'node:path';
import { buildJSXTypes } from '../common/build/index.js';

buildJSXTypes(path.resolve('./packages/mdui/custom-elements.json'), 'mdui');
