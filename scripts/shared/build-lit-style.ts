import path from 'node:path';
import { buildLitStyleFiles } from '../common/build/index.js';

buildLitStyleFiles(path.resolve('./packages/shared/src/lit-styles'));
buildLitStyleFiles(path.resolve('./packages/shared/src/icons/shared'));
