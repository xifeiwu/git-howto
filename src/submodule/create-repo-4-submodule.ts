import * as fs from "fs";
import * as path from "path";
import { exec, execSync } from "child_process";
import { deleteFile } from "../utils/common";

export const REPO_DIR = path.resolve(__dirname, "repo-dir");

function runCommands(commands: string[]) {
  for (let i = 0; i < commands.length; i++) {
    execSync(commands[i]);
  }
}
export async function reCreateRepo() {
  if (fs.existsSync(REPO_DIR)) {
    deleteFile(REPO_DIR);
  }
  fs.mkdirSync(REPO_DIR);
  process.chdir(REPO_DIR);
  runCommands([
    `git --git-dir=lib.git init --bare`,
    `git --git-dir=component.git init --bare`,
    `git --git-dir=project-a.git init --bare`,
    `git --git-dir=project-b.git init --bare`,
  ]);

  const useRebase = false;
  /** init repo */
  // runCommands([
  //   "git init .",
  //   "git checkout -b develop",
  //   `echo 'demo for rebase' > README.md`,
  //   "git add README.md",
  //   'git commit -m "init repo"',
  //   "git checkout -b start develop",
  // ]);

  // (() => {
  //   const branch = "feature-a";
  //   const commands: string[] = [];
  //   commands.push(`git checkout -b ${branch} start`);
  //   new Array(3).fill("").forEach((_it, index) => {
  //     const fileName = `${branch}-commit-${index}`;
  //     commands.push(`echo ${fileName} > ${fileName}`);
  //     commands.push(`git add ${fileName}`);
  //     commands.push(`git commit -m "add ${fileName}"`);
  //   });
  //   runCommands(commands);
  //   if (useRebase) {
  //     runCommands([
  //       `git rebase develop`,
  //       "git checkout develop",
  //       `git merge ${branch} --no-ff`,
  //     ]);
  //   } else {
  //     runCommands(["git checkout develop", `git merge ${branch} --no-ff`]);
  //   }
  // })();
}

export function createRepoIfNotExist() {
  if (fs.existsSync(REPO_DIR)) {
    return;
  }
  reCreateRepo();
}
reCreateRepo();
