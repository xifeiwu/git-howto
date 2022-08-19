
# Git项目实践

1. git storage model
2. git branch management
3. usecase of git submodule
4. useful git commands

# 1. git storage model

## 1.1 Relation between raw content, formatted content, and fileName(sha1)

<!-- - ![img](assets/imgs/objects-structure.png) -->
<img src="assets/imgs/object-structure.png" alt="object-structure" width="800"/>

## 1.2 Format of each Object's content

### commit
  
```
tree 8368d93a6c2197eacdf1fe5f62e8eb872c38b63b
parent e02344a1f0f2d8a1f75db5a2368d315ad41dd2b3
author wuxifei <xfwu@conviva.com> 1658419392 +0800
committer wuxifei <xfwu@conviva.com> 1658419392 +0800

add README.md
```

### tree

```
100644 blob fd4f2b066b339e4fd5c0efd44938231a398e9a81    .gitignore
040000 tree acbe07d92660f57d2ee1c395ad0e8b45e33a2751    1-storage
100644 blob fd4a2f26a8fdbb3aeb9cb039cc76e39e34114250    README.md
100644 blob 3eb5c4bf5f3ebeada1d51fe9b248be9d51e8f18a    package.json
100644 blob 024cf68d3a780214a5c276eece588cdbb3cdd7eb    tsconfig.json
040000 tree 5535743ffa73aeb2ed61bac26c28d4199be59806    utils
100644 blob 4df4f8b4eef64bc39cef01abde23fd0331881ebd    yarn.lock
```

### blob

```
This is summary of git usage
```

### tag

```
object 76e758e22aca7d6c8f699c1d814fb1d56b71d7a3
type commit
tag v1.0
tagger wuxifei <xfwu@conviva.com> 1658991628 +0800

add tag v1.0
```

## 1.3 Structure of commit tree

<img src="assets/imgs/commit-tree.png" alt="commit-tree" width="528" height="368">
<img src="assets/imgs/commit-tree-complex.png" alt="commit-tree-complex" width="528" height="368">

## 1.4 Thought of commit tree

### git gc

- git fsck 版本库中未被任何引用关联的对象
- git gc --prune=now清除悬空的结点

### others

- how git diff work
- any change to blob, tree, commit will collapse children's commitId
- add existed file will not increase the size of .git/objects

- 任何一个历史blob, commit修改，都会导致之后commitId的变化，fast-forward。

### reference

[The Biggest Misconception About Git](https://medium.com/@gohberg/the-biggest-misconception-about-git-b2f87d97ed52)
# 2. git branch management

## 2.1 git flow

### git flow

<img src="assets/imgs/git-flow.png" alt="git-flow" width="575" height="762">

### github flow

<img src="assets/imgs/github-flow.webp" alt="github-flow" width="600" height="200">

[Simple Git workflow is simple](https://www.atlassian.com/blog/git/simple-git-workflow-is-simple)

### git rebase vs. git merge

<img src="assets/imgs/git-merge-1.png" alt="git-merge-1" width="600" height="247">
<img src="assets/imgs/git-merge-2.png" alt="git-merge-2" width="600" height="247">

<img src="assets/imgs/git-rebase.png" alt="git-rebase" width="600" height="280">

<img src="assets/imgs/commit-tree-by-rebase.png" alt="git-rebase" width="300" height="200">
<img src="assets/imgs/commit-tree-by-merge.png" alt="git-rebase" width="300" height="200">

- reference 

[A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
[Introduction to GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)
[Git 工作流程](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

[topgit](https://mackyle.github.io/topgit/topgit.html)

# pr
# usecase of git submodule

[git子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

reference

[Git Submodule使用完整教程](https://www.cnblogs.com/lsgxeva/p/8540758.html)
# useful git commands

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

# References


[git book](https://git-scm.com/book/en/v2)

<style>
  h1, h2, h3 {
    font-family: Adelle, Roboto Slab, DejaVu Serif, Georgia, Times New Roman, sans-serif;
  }
  h3 {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    line-height: 44px;
    color: #f14e32;
  }
</style>