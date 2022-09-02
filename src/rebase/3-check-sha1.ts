import { sha1sum } from '../utils/common';
import { unzipFile } from '../utils/git/objects';
import * as fs from 'fs';
import * as path from 'path';

const {argv} = process;
if (argv.length < 3) {
  throw new Error(`file path not found`);
}
const [,,relativePath] = argv;
const fullPath = path.resolve(process.cwd(), relativePath);
if (!fs.existsSync(fullPath)) {
  throw new Error(`file ${fullPath} not exist!`);
}

const buf = unzipFile(fullPath);
if (buf) {
  console.log(sha1sum(buf));
}