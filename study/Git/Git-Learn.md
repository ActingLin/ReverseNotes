# Git 学习笔记

## 一、Git 基础概念

Git 是一个**分布式版本控制系统**，每个开发者的电脑上都有一个完整的仓库副本。

### 三个工作区域

| 区域 | 说明 |
|------|------|
| **工作区 (Working Directory)** | 你编辑文件的地方 |
| **暂存区 (Staging Area)** | `git add` 后文件进入暂存区，等待提交 |
| **本地仓库 (Local Repository)** | `git commit` 后文件保存到本地仓库 |

### 文件状态流转

```
未跟踪 (Untracked)
    │  git add
    ▼
已暂存 (Staged)
    │  git commit
    ▲
已提交 (Committed) ──── git reset HEAD ──── 回到已暂存
    │
    │  修改文件
    ▼
已修改 (Modified) ──── git checkout -- <file> ──── 撤销修改
```

---

## 二、初始化与配置

```bash
# 初始化本地仓库
git init

# 克隆远程仓库
git clone <url>
git clone <url> <目录名>          # 指定目录名

# 用户配置（首次使用必须设置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 查看配置
git config --list
git config user.name
```

> `--global` 表示全局配置，对所有仓库生效。去掉 `--global` 则只对当前仓库生效。

---

## 三、个人使用 — 日常操作

### 3.1 提交流程

```bash
git status                  # 查看工作区状态
git add <file>              # 添加指定文件到暂存区
git add .                   # 添加所有变更文件
git commit -m "提交信息"     # 提交暂存区到本地仓库
git commit -am "信息"       # 跳过 add，直接提交已跟踪文件的修改
```

### 3.2 查看历史

```bash
git log                     # 完整提交日志
git log --oneline           # 简洁模式（一行一条）
git log --graph --oneline --all   # 图形化分支历史
git log -n 5                # 最近 5 条
git log --author="名字"     # 按作者筛选
git log --since="2025-01-01"  # 按日期筛选

git reflog                  # 查看所有操作记录（含已删除的提交，可用于恢复）
git show <commit_id>        # 查看某次提交的详细内容
git blame <file>            # 查看文件每行最后修改人
```

### 3.3 查看差异

```bash
git diff                    # 工作区 vs 暂存区
git diff --cached           # 暂存区 vs 最新提交
git diff HEAD               # 工作区 vs 最新提交
git diff <branch1> <branch2>  # 两个分支的差异
```

### 3.4 撤销与回退

```bash
# 撤销工作区修改（恢复到暂存区状态）
git checkout -- <file>
# Git 2.23+ 推荐：
git restore <file>

# 从暂存区移除（保留工作区修改）
git reset HEAD <file>
# Git 2.23+ 推荐：
git restore --staged <file>

# 回退提交
git reset --soft HEAD~1     # 回退提交，保留暂存区和工作区
git reset --mixed HEAD~1    # 回退提交，保留工作区（默认模式）
git reset --hard HEAD~1     # 彻底回退，丢弃所有变更（慎用！）

# 修改最近一次提交
git commit --amend          # 修改提交信息或补充遗漏文件
```

> `HEAD~1` 表示上一次提交，`HEAD~2` 表示上上次，以此类推。

### 3.5 暂存工作 (Stash)

当你需要临时切换分支但不想提交当前工作时：

```bash
git stash                   # 暂存当前工作区
git stash push -m "描述"    # 带描述信息暂存
git stash list              # 查看所有暂存
git stash pop               # 恢复最近一次暂存并删除记录
git stash apply stash@{0}   # 恢复指定暂存（保留记录）
git stash drop stash@{0}    # 删除指定暂存
git stash clear             # 清空所有暂存

# 高级用法
git stash --include-untracked (-u)  # 包含未跟踪文件
git stash --all                     # 包含被忽略的文件
git stash show -p stash@{0}         # 查看暂存的具体差异
git stash branch <name> stash@{0}   # 基于暂存创建新分支
git stash apply --index             # 恢复时保留暂存区状态
```

---

## 四、个人使用 — 分支管理

### 4.1 分支基础操作

```bash
git branch                  # 查看本地分支
git branch -a               # 查看所有分支（含远程）
git branch -v               # 查看各分支最后提交

git branch <name>           # 创建新分支
git checkout <branch>       # 切换分支
git checkout -b <name>      # 创建并切换（旧写法）
git switch <branch>         # 切换分支（Git 2.23+ 推荐）
git switch -c <name>        # 创建并切换（Git 2.23+ 推荐）

git branch -d <name>        # 删除已合并的分支
git branch -D <name>        # 强制删除分支
git branch -m <old> <new>   # 重命名分支
```

### 4.2 合并与变基

**Merge（合并）：**
```bash
git merge <branch>          # 将指定分支合并到当前分支
git merge --no-ff <branch>  # 禁用快进合并，保留分支历史
```

**Rebase（变基）：**
```bash
git rebase <branch>         # 将当前分支的提交"移植"到目标分支之后
git rebase --abort          # 放弃 rebase
git rebase --continue       # 解决冲突后继续 rebase
```

**Merge vs Rebase 对比：**

| 特性 | Merge | Rebase |
|------|-------|--------|
| 历史记录 | 非线性，保留分支拓扑 | 线性，干净整洁 |
| 提交记录 | 保留原始 hash | 改写 hash |
| 合并提交 | 产生 merge commit | 无额外 commit |
| 冲突处理 | 一次性解决 | 可能逐个 commit 解决 |

**黄金法则：不要对已推送到远程的公共分支执行 rebase。**

### 4.3 Cherry-pick（拣选提交）

将指定提交应用到当前分支：

```bash
git cherry-pick <commit_id>       # 拣选单个提交
git cherry-pick A..B              # 拣选 A 到 B 范围（不含 A）
git cherry-pick A^..B             # 拣选 A 到 B 范围（含 A）
git cherry-pick --no-commit <id>  # 只应用变更，不自动提交
git cherry-pick -m 1 <merge-id>   # 拣选合并提交的某一侧
git cherry-pick --abort           # 放弃拣选
```

### 4.4 标签 (Tag)

```bash
git tag                             # 查看所有标签
git tag <tagname>                   # 创建轻量标签
git tag -a <tagname> -m "说明"      # 创建附注标签
git tag -a <tagname> <commit_id>    # 给指定提交打标签
git push origin <tagname>           # 推送单个标签
git push origin --tags              # 推送所有标签
git tag -d <tagname>                # 删除本地标签
git push origin :refs/tags/<tagname>  # 删除远程标签
```

**语义化版本规范：**

| 标签格式 | 含义 | 示例 |
|---------|------|------|
| `v1.0.0` | 正式发布版本 | `v1.0.0` |
| `v1.0.0-alpha` | 内测版 | `v0.1.0-alpha` |
| `v1.0.0-beta` | 公测版 | `v0.9.0-beta` |
| `v1.0.0-rc1` | 候选发布版 | `v1.0.0-rc1` |

---

## 五、远程仓库操作

```bash
git remote -v                   # 查看远程仓库
git remote add origin <url>     # 添加远程仓库
git remote remove <name>        # 移除远程仓库

git fetch origin                # 拉取远程更新（不自动合并）
git pull origin <branch>        # 拉取并合并（= fetch + merge）
git pull --rebase origin <branch>  # 拉取并变基（推荐，历史更干净）

git push origin <branch>        # 推送到远程
git push -u origin main         # 首次推送并设置上游分支
git push origin --delete <branch>  # 删除远程分支
git push --force-with-lease     # 安全的强制推送（检查远程状态）
```

> `--force-with-lease` 比 `--force` 更安全，它会检查远程分支是否被他人更新过。

---

## 六、团队协作 — 工作流

### 6.1 GitFlow 工作流

适合版本发布周期较长、需要维护多个版本的项目。

**核心分支：**
- `main/master` — 生产环境的稳定代码
- `develop` — 开发主线，集成最新功能
- `feature/*` — 功能分支，从 develop 创建
- `release/*` — 发布分支，准备新版本
- `hotfix/*` — 紧急修复，从 main 创建

```
main     ──●──────────────●──────────────●──
             \           / ↑            /
hotfix        \         /  |           /
               \       /   |          /
develop    ─────●───●───●───●───●───●───●───
                /       ↑       \       ↑
feature/A     ●───●    |    feature/B ●──●
                      release/1.0
```

**典型流程：**
```bash
# 1. 开始新功能
git checkout develop
git checkout -b feature/login

# 2. 开发并提交
git add .
git commit -m "feat: 实现登录功能"

# 3. 完成后合并回 develop
git checkout develop
git merge --no-ff feature/login
git branch -d feature/login

# 4. 准备发布
git checkout -b release/1.0 develop
# 修复 bug、更新版本号...
git checkout main
git merge --no-ff release/1.0
git tag -a v1.0.0 -m "版本 1.0.0"
git checkout develop
git merge --no-ff release/1.0

# 5. 紧急修复
git checkout main
git checkout -b hotfix/fix-crash
# 修复...
git checkout main
git merge --no-ff hotfix/fix-crash
git tag -a v1.0.1 -m "紧急修复"
git checkout develop
git merge --no-ff hotfix/fix-crash
```

### 6.2 GitHub Flow 工作流

适合持续部署的 Web 应用，流程简单高效。

**核心分支：**
- `main` — 唯一的长期分支，始终可部署
- `feature/*` — 短生命周期的功能分支

**流程：**
```
1. 从 main 创建功能分支
2. 开发并提交
3. 推送并创建 Pull Request
4. 团队 Code Review
5. CI/CD 自动测试通过
6. 合并到 main
7. 自动部署
8. 删除功能分支
```

```bash
git checkout main
git pull origin main
git checkout -b feature/add-search

# 开发...
git add .
git commit -m "feat: 添加搜索功能"
git push origin feature/add-search

# 在 GitHub/GitLab 上创建 Pull Request
# Code Review + CI 通过后合并
# 合并后删除分支
git checkout main
git pull origin main
git branch -d feature/add-search
```

### 6.3 Forking 工作流（开源项目常用）

```
1. Fork 原仓库到自己的账号
2. Clone 自己的 Fork 到本地
3. 添加原仓库为 upstream
4. 创建功能分支
5. 开发并推送到自己的 Fork
6. 向原仓库提交 Pull Request
```

```bash
git clone https://github.com/你的用户名/项目.git
cd 项目
git remote add upstream https://github.com/原作者/项目.git
git checkout -b feature/my-contribution

# 开发...
git push origin feature/my-contribution
# 在 GitHub 上创建 PR

# 同步原仓库更新
git fetch upstream
git checkout main
git merge upstream/main
```

### 6.4 工作流对比

| 特性 | GitFlow | GitHub Flow | Forking |
|------|---------|-------------|---------|
| 复杂度 | 高 | 低 | 中 |
| 分支数量 | 多（5类） | 少（2类） | 中 |
| 发布周期 | 定期发布 | 持续部署 | 不定 |
| 适用团队 | 大团队 | 小团队 | 开源社区 |
| 学习成本 | 较高 | 较低 | 中等 |

---

## 七、团队协作 — Pull Request 与 Code Review

### 7.1 Pull Request 最佳实践

1. **保持 PR 小而聚焦** — 建议不超过 400 行变更
2. **写好标题和描述** — 说明做了什么、为什么做
3. **关联 Issue** — 如 `Closes #123`
4. **UI 变更附截图** — 方便 Reviewer 理解
5. **使用 PR 模板** — 保持一致性

### 7.2 Code Review 最佳实践

1. **及时响应** — 24 小时内完成 Review
2. **分批审查** — 每次 200-400 行，超过后注意力下降
3. **建设性反馈** — 用提问代替命令
4. **自动化先行** — CI/CD、Lint、测试 先跑通再人工 Review
5. **使用清单** — 安全性、可读性、测试、文档

### 7.3 Commit Message 规范 (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): 添加微信登录` |
| `fix` | 修复 Bug | `fix(api): 修复空指针异常` |
| `docs` | 文档更新 | `docs: 更新 README` |
| `style` | 代码格式（不影响逻辑） | `style: 格式化代码` |
| `refactor` | 重构 | `refactor: 提取公共方法` |
| `test` | 测试 | `test: 添加登录单元测试` |
| `chore` | 构建/工具 | `chore: 升级依赖版本` |

---

## 八、团队协作 — 冲突解决

### 8.1 产生冲突的原因

当两个分支修改了同一文件的同一区域，Git 无法自动合并，需要手动解决。

### 8.2 冲突标记

```
<<<<<<< HEAD
当前分支的内容
=======
要合并的分支的内容
>>>>>>> feature-branch
```

### 8.3 解决步骤

```bash
# 1. 合并时出现冲突
git merge feature-branch
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt

# 2. 查看冲突文件
git status

# 3. 编辑冲突文件，手动选择保留的内容
# 删除 <<<<<<< ======= >>>>>>> 标记，保留正确代码

# 4. 标记冲突已解决
git add <file>

# 5. 完成合并
git commit
```

### 8.4 冲突解决工具

```bash
git mergetool                 # 打开可视化合并工具
git merge --abort             # 放弃本次合并
git rebase --abort            # 放弃本次 rebase

# 选择保留某一侧
git checkout --ours <file>    # 保留当前分支的版本
git checkout --theirs <file>  # 保留对方分支的版本

# 启用 rerere（自动记住冲突解决方案）
git config --global rerere.enabled true
```

---

## 九、高级技巧

### 9.1 Git Bisect（二分查找定位 Bug）

```bash
git bisect start
git bisect bad                # 标记当前版本有 Bug
git bisect good v1.0.0        # 标记某个版本正常
# Git 会自动 checkout 中间版本供你测试
# 测试后标记 good 或 bad，直到找到引入 Bug 的提交
git bisect reset              # 结束 bisect
```

### 9.2 Git Hooks（钩子）

Git 钩子在特定事件触发时自动执行脚本，位于 `.git/hooks/` 目录。

| 钩子 | 触发时机 | 常见用途 |
|------|---------|---------|
| `pre-commit` | 提交前 | 代码格式化、Lint 检查 |
| `commit-msg` | 提交信息写入后 | 检查 commit message 格式 |
| `pre-push` | 推送前 | 运行测试 |
| `post-merge` | 合并后 | 自动安装依赖 |

### 9.3 Submodule（子模块）

将另一个 Git 仓库作为子目录嵌入当前仓库：

```bash
git submodule add <url> <path>              # 添加子模块
git submodule update --init --recursive      # 初始化子模块
git submodule update --remote                # 更新到远程最新
git submodule foreach 'git pull origin main' # 批量操作
git submodule deinit <path>                  # 移除子模块
git clone --recurse-submodules <url>         # 克隆时自动拉取子模块
```

### 9.4 .gitignore

```gitignore
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录
node_modules/

# 忽略编译输出
dist/
build/

# 忽略环境变量文件
.env
.env.local

# 但不忽略某个文件
!important.log
```

### 9.5 实用别名

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --graph --oneline --all --decorate"
git config --global alias.last "log -1 HEAD"
git config --global alias.unstage "reset HEAD --"
```

---

## 十、常用场景速查表

| 场景 | 命令 |
|------|------|
| 初始化仓库 | `git init` |
| 克隆仓库 | `git clone <url>` |
| 查看状态 | `git status` |
| 添加到暂存区 | `git add .` |
| 提交 | `git commit -m "msg"` |
| 创建分支 | `git switch -c <name>` |
| 切换分支 | `git switch <branch>` |
| 合并分支 | `git merge <branch>` |
| 拉取远程更新 | `git pull --rebase` |
| 推送到远程 | `git push origin <branch>` |
| 暂存工作 | `git stash` |
| 恢复暂存 | `git stash pop` |
| 查看历史 | `git log --oneline --graph` |
| 撤销工作区修改 | `git restore <file>` |
| 撤销暂存 | `git restore --staged <file>` |
| 回退提交 | `git reset --soft HEAD~1` |
| 查看差异 | `git diff` |
| 打标签 | `git tag -a v1.0.0 -m "msg"` |

---

## 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Atlassian Git 教程](https://www.atlassian.com/git/tutorials)
- [Learn Git Branching（交互式学习）](https://learngitbranching.js.org/?locale=zh_CN)
- [GitHub 文档](https://docs.github.com/en/get-started)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
