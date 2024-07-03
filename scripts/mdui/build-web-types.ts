import path from 'node:path';
import { buildWebTypes } from '../common/build/index.js';

buildWebTypes(path.resolve('./packages/mdui/custom-elements.json'), 'mdui');
