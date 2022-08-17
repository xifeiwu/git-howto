#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import { calSha1Sum } from "../utils/git/objects";

const {argv} = process;
if (argv.length <= 1) {
  throw new Error(`sha1 should be given`);
}
const [, , filePath] = argv;

const fullPath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(fullPath)) {
  throw new Error(`file ${fullPath} not exist`);
}
const buffer = fs.readFileSync(fullPath);
const sha1sum = calSha1Sum('blob', buffer);
console.log(sha1sum);
// console.log(buf.slice(0, 1024).toString('utf-8'));