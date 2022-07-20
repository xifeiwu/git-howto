import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import {readDirRecursive} from '../utils/common';
import { REPO_DIR, createRepoIfNotExist } from './create-repo';

function unzip(path: string) {
  if (!fs.existsSync(path)) {
    throw new Error(`path ${path} not exist`);
  }
  const buffer = fs.readFileSync(path);
  return zlib.unzipSync(buffer).toString('utf-8');
}

createRepoIfNotExist();
process.chdir(REPO_DIR);
const OBJECTS_DIR = `${REPO_DIR}/.git/objects`;
const files: {
  path: string;
  shasum: string;
  content: string;
}[] = readDirRecursive(OBJECTS_DIR).map(it => {
  const shasum = it.split('/').join('');
  return {
    path: it,
    shasum,
    content: unzip(path.join(OBJECTS_DIR, it))
  }
});
// const buffer = fs.readFileSync();
// console.log(buffer);
// console.log(unzip(buffer).toString());
// const shaList = files.map(it => {
  // const 
// });
console.log(files);
