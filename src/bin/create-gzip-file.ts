#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import {Stream} from 'stream';
import stream = require('stream');
// import { buffer } from 'stream/consumers';
import parse from '../utils/bytes';
import {getStreamGenerateRandomString, isNumber} from '../utils/common';

const {argv} = process;
if (argv.length <= 2) {
  throw new Error(`file size should be set`);
}
const [, , name, size] = argv;
// const size = parse(argv[2]);
const length = parse(size);
if (!isNumber(length)) {
  throw new Error(`${length} is not a number`);
}
// console.log(`will create file ${name} with size ${length}`);
// fs.writeFileSync(path.join(process.cwd(), name), Buffer.alloc(length, '0'));

function getTransform(reader: stream.Readable, threshold: number) {
  let transferredSize = 0;
  return new Stream.Transform({
    transform(chunk: Buffer, _enc, done) {
      if (transferredSize < threshold) {
        if (threshold - transferredSize >= chunk.length) {
          this.push(chunk);
          console.log(`write size: ${chunk.length}`);
          transferredSize += chunk.length;
        } else {
          this.push(chunk.slice(0, threshold - transferredSize));
          console.log(`write size: ${threshold - transferredSize}`);
          transferredSize = threshold;
        }
        done();
      } else {
        reader.destroy();
      }
    },
    final(cb) {
      cb();
    },
  });
}

const reader = getStreamGenerateRandomString();
reader
  .pipe(zlib.createGzip())
  .pipe(getTransform(reader, length))
  // .pipe(process.stdout);
  .pipe(fs.createWriteStream(path.join(process.cwd(), name)));
