import * as fs from 'fs';
import * as path from 'path';
import {execSync} from 'child_process';
import {deleteFile} from '../utils/common';

export const REPO_DIR = path.resolve(__dirname, 'git-repo');

export function reCreateRepo() {
  if (fs.existsSync(REPO_DIR)) {
    deleteFile(REPO_DIR);
  }
  // process.exit(0)
  fs.mkdirSync(REPO_DIR);
  process.chdir(REPO_DIR);
  execSync('git init .');
  ['a', 'b', 'c'].forEach((it, index) => {
    const fileName = `file${index}.txt`;
    fs.writeFileSync(fileName, Buffer.from(it));
    execSync(`git add ${fileName}`);
    execSync(`git commit -m "commit ${index}"`);
  });
}

export function createRepoIfNotExist() {
  if (fs.existsSync(REPO_DIR)) {
    return;
  }
  reCreateRepo();
}
