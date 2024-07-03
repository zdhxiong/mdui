import path from 'node:path';
import { buildLitStyleFiles } from '../common/build/index.js';

buildLitStyleFiles(path.resolve('./packages/mdui/src/components'));
