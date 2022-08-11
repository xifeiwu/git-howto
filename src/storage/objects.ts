import * as fs from 'fs';
import * as path from 'path';
import {readDirRecursive, sha1sum, unzip} from '../utils/common';

export function listObjects(repoDir: string) {
  if (!fs.existsSync(repoDir)) {
    throw new Error(`repoDir ${repoDir} not exist`);
  }
  process.chdir(repoDir);
  const OBJECTS_DIR = `${repoDir}/.git/objects`;
  const files: {
    path: string;
    shasum: string;
    content: string;
  }[] = readDirRecursive(OBJECTS_DIR, {
    dirFilter(dirPath) {
      if (!dirPath) {
        return false;
      }
      const lastDir = dirPath.split('/').pop();
      if (!lastDir) {
        return false;
      }
      return lastDir.length === 2;
    }
  }).map(it => {
    const shasum = it.split('/').join('');
    return {
      path: it,
      shasum,
      content: unzip(path.join(OBJECTS_DIR, it))
    }
  });
  return files;
}

export function checkObject(repoDir: string, shasum: string) {
  if (!fs.existsSync(repoDir)) {
    throw new Error(`repoDir ${repoDir} not exist`);
  }
  process.chdir(repoDir);
  const OBJECTS_DIR = `${repoDir}/.git/objects`;
  const shasumPath = shasum.slice(0, 2) + '/' + shasum.slice(2);
  const filePath = path.join(OBJECTS_DIR, shasumPath);
  const buffer = zlib.unzipSync(fs.readFileSync(filePath));
  const str = buffer.toString('utf-8');
  const newShaSum = sha1sum(buffer);
  // const content = 
  console.log(shasum);
  console.log(buffer);
  console.log(str);
  console.log(newShaSum);
}

export function calSha1Sum(type: 'blob' | 'tree' | 'commit' | 'tag', content: string | Buffer) {
  if (!Buffer.isBuffer(content)) {
    content = Buffer.from(content);
  }
  const prefix = Buffer.from(`${type} ${content.byteLength}\x00`);
  return sha1sum(Buffer.concat([prefix, content]));
}
