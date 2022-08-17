import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import {findClosestFile, sha1sum} from '../common';

export function unzipFile(zipFile?: string | null) {
  if (!zipFile) {
    throw new Error(`path of zipFile is needed`);
  }
  if (!fs.existsSync(zipFile)) {
    throw new Error(`file ${zipFile} not exist`);
  }
  return zlib.unzipSync(fs.readFileSync(zipFile));
}

export function unzipBySha1(sha1sum: string) {
  const shasumPath = sha1sum.slice(0, 2) + '/' + sha1sum.slice(2);
  const fullPath = findClosestFile(process.cwd(), `.git/objects/${shasumPath}`);
  if (!fullPath) {
    throw new Error(`path for ${sha1sum} is not found`);
  }
  const buf = unzipFile(fullPath);
  return buf;
}

export function calSha1Sum(type: 'blob' | 'tree' | 'commit' | 'tag', content: string | Buffer) {
  if (!Buffer.isBuffer(content)) {
    content = Buffer.from(content);
  }
  const prefix = Buffer.from(`${type} ${content.byteLength}\x00`);
  return sha1sum(Buffer.concat([prefix, content]));
}
