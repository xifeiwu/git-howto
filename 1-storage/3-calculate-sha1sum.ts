
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { calSha1Sum } from './objects';

// 1-list-objects.ts
// const sha1sum = calSha1Sum('blob', fs.readFileSync(path.join(__dirname, '2-check-sha.ts')));
// console.log(sha1sum);

// const file = '/Users/wuxifei/Documents/projects/conviva/semantic-mapper-frontend/src/pages/components/RuleMapper/index.tsx'
const file = '/Users/xifeiwu/Documents/projects/bash/project/git-howto/1-storage/git-repo/big-file.txt';
const sha1sum = calSha1Sum('blob', fs.readFileSync(file));
console.log(sha1sum);
// const tagSha1sum = calSha1Sum('tag', execSync(`git cat-file -p v1.0`));
// console.log(tagSha1sum);