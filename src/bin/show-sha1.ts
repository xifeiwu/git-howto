#!/usr/bin/env ts-node

import { unzipBySha1 } from "../utils/git/objects";

const {argv} = process;
if (argv.length <= 1) {
  throw new Error(`sha1 should be given`);
}
const [, , sha1sum] = argv;

const buf = unzipBySha1(sha1sum);
console.log(buf.slice(0, 1024).toString('utf-8'));