#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
// import { buffer } from 'stream/consumers';
import parse from '../utils/bytes';
import { isNumber } from '../utils/common';

const {argv} = process;
if (argv.length <= 2) {
  throw new Error(`file size should be set`);
}
const [,, name, size] = argv;
// const size = parse(argv[2]);
const length = parse(size);
if (!isNumber(length)) {
  throw new Error(`${length} is not a number`);
}
console.log(`will create file ${name} with size ${length}`);
fs.writeFileSync(path.join(process.cwd(), name), Buffer.alloc(length, '0'));