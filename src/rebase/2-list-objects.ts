import * as fs from "fs";
import * as path from "path";
import { readDirRecursive, unzip } from "../utils/common";
import { REPO_DIR } from "./create-repo-4-rebase";

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
      const lastDir = dirPath.split("/").pop();
      if (!lastDir) {
        return false;
      }
      return lastDir.length === 2;
    },
  }).map((it) => {
    const shasum = it.split("/").join("");
    return {
      path: it,
      shasum,
      content: unzip(path.join(OBJECTS_DIR, it)),
    };
  });
  return files;
}

console.log(listObjects(REPO_DIR));
