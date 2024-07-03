import path from 'node:path';
import { buildVSCodeData } from '../common/build/index.js';

buildVSCodeData(path.resolve('./packages/mdui/custom-elements.json'), 'mdui');
