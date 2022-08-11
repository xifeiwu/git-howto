#!/usr/bin/env ts-node
import { unzip } from '../utils/common';
import * as path from 'path';
const {argv} = process;
const params = argv.slice(2);
if (params.length == 0) {
  throw new Error(`please input file path`);
}
const [file] = params;
const fullPath = path.resolve(process.cwd(), file);
console.log(unzip(fullPath));