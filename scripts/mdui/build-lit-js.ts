import path from 'node:path';
import { buildLitJsFiles } from '../common/build/index.js';

buildLitJsFiles(path.resolve('./packages/mdui/src/components'));
