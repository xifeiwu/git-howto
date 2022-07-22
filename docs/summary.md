
# 目录

1. git数据存储模型

# git数据存储模型

- 有四种Object: Blob, Commit, Tree, Tag
- 存储格式，文件名sha1sum, 文件内容，原始内容的关系
  - ![img](assets/imgs/objects-structure.png)
- Commit data 格式
```tree 8368d93a6c2197eacdf1fe5f62e8eb872c38b63b
parent e02344a1f0f2d8a1f75db5a2368d315ad41dd2b3
author wuxifei <xfwu@conviva.com> 1658419392 +0800
committer wuxifei <xfwu@conviva.com> 1658419392 +0800

add README.md```
- tree content 格式
```
100644 blob fd4f2b066b339e4fd5c0efd44938231a398e9a81    .gitignore
040000 tree acbe07d92660f57d2ee1c395ad0e8b45e33a2751    1-storage
100644 blob fd4a2f26a8fdbb3aeb9cb039cc76e39e34114250    README.md
100644 blob 3eb5c4bf5f3ebeada1d51fe9b248be9d51e8f18a    package.json
100644 blob 024cf68d3a780214a5c276eece588cdbb3cdd7eb    tsconfig.json
040000 tree 5535743ffa73aeb2ed61bac26c28d4199be59806    utils
100644 blob 4df4f8b4eef64bc39cef01abde23fd0331881ebd    yarn.lock
```

- blob content 格式
```文件内容```

- 暂存区也有tree
- git gc
- 存储的树状结构
- 任何一个历史blob, commit修改，都会导致之后commitId的变化，fast-forward。
- hooks: pre-commit, post-receive

# git分支管理

[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
[Git 工作流程](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

topgit

# pr
# submodule

```
git archive -o xxx.zip commit
git push origin local_branch:remote_branch
git push origin :remote_branch
git stash
git gc/prune
git merge-base
git log -p <filename>
git log --author=<author>
```