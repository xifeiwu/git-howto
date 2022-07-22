
import { REPO_DIR, createRepoIfNotExist } from './create-repo';
import { listObjects } from './objects';

createRepoIfNotExist();
const files = listObjects(REPO_DIR);
console.log(files);
