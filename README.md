# 传承经典诗词大赛系统

面向现场活动的双屏诗词竞赛系统。

- 一个浏览器窗口作为控制台：`/#/admin`
- 一个浏览器窗口作为大屏：`/#/screen`

项目基于 `Vue 3 + Vite`，采用纯前端方案，通过 `BroadcastChannel + LocalStorage` 在同机双窗口之间同步状态，适合校内活动、教室大屏、礼堂现场等轻部署场景。

## 项目特点

- 根目录可直接运行 `npm install` 和 `npm run dev`
- 无需后端服务，部署简单
- 支持控制台与大屏双窗口同步
- 支持比赛状态本地持久化
- 倒计时基于时间戳恢复，刷新后不会简单“停表”
- 已区分“重置分数”和“重置比赛”两种操作

## 目录结构

```text
poetry-system/
├─ package.json
├─ package-lock.json
├─ README.md
├─ .github/
│  └─ workflows/
│     └─ deploy-pages.yml
└─ app/
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   ├─ public/
   │  └─ questions.json
   └─ src/
      ├─ App.vue
      ├─ main.js
      ├─ style.css
      ├─ utils/
      │  ├─ channel.js
      │  └─ storage.js
      └─ views/
         ├─ Admin.vue
         └─ Screen.vue
```

## 环境要求

- Node.js 18+
- npm 9+

建议使用最新 LTS 版本的 Node.js。

## 本地开发

在仓库根目录执行：

```bash
npm install
npm run dev
```

启动后默认访问：

- 控制台：`http://localhost:5173/#/admin`
- 大屏：`http://localhost:5173/#/screen`

如需改端口：

```bash
npm run dev -- --port 3000
```

对应地址变为：

- `http://localhost:3000/#/admin`
- `http://localhost:3000/#/screen`

## 生产构建

在仓库根目录执行：

```bash
npm run build
```

构建产物位于 `app/dist`。

## GitHub Pages 部署

项目已经内置 GitHub Pages 自动部署工作流：

- 工作流文件：[`deploy-pages.yml`](/d:/EchoRan/Documents/GitHub/poetry-system/.github/workflows/deploy-pages.yml)
- 触发方式：推送到 `main` 分支，或在 GitHub Actions 页面手动执行
- 构建命令：`npm run build`
- 发布目录：`app/dist`

首次启用时需要在 GitHub 仓库设置中确认：

1. 打开仓库 `Settings`
2. 进入 `Pages`
3. 将 Source 设置为 `GitHub Actions`

如果仓库 Pages 地址为：

```text
https://<用户名>.github.io/<仓库名>/
```

那么页面入口通常是：

- 控制台：`https://<用户名>.github.io/<仓库名>/#/admin`
- 大屏：`https://<用户名>.github.io/<仓库名>/#/screen`

本项目已经改为 `createWebHashHistory()`，适合 GitHub Pages 这类静态托管环境。

## 使用说明

### 控制台

控制台页面用于：

- 选择题目
- 同步题目到大屏
- 开始或停止倒计时
- 揭晓答案
- 给队伍加减分
- 重置分数
- 重置整场比赛

### 大屏

大屏页面用于：

- 展示当前题目
- 展示倒计时
- 展示答案
- 展示实时积分

### 快捷键

控制台支持以下快捷键：

- `Space`：开始或停止倒计时
- `Enter`：揭晓答案
- `ArrowRight`：下一题
- `S`：同步到大屏

## 题库数据

题库文件位置：

[`questions.json`](/d:/EchoRan/Documents/GitHub/poetry-system/app/public/questions.json)

每道题建议包含这些字段：

```json
{
  "id": "unique_id",
  "stage": "题型名称",
  "rule": "规则说明",
  "question": "题目内容",
  "answer": "标准答案",
  "key_point": "主持人提示",
  "time_limit": 15
}
```

## 状态同步与恢复

系统目前使用两层机制保证现场稳定性：

- `BroadcastChannel`：同机双窗口实时同步
- `LocalStorage`：状态持久化与异常恢复

会保存的核心状态包括：

- 当前题目
- 当前阶段
- 队伍分数
- 是否已揭晓答案
- 倒计时状态

倒计时使用 `endAt` 时间戳恢复，所以页面刷新后会按真实经过时间继续计算。

## 已知限制

- 更适合同一台机器上的双窗口场景，不适合跨设备联动
- 题库目前是静态 `JSON`，适合活动前编辑，不适合多人在线实时协作
- 没有后端审计日志，误操作主要依赖本地缓存恢复

## 常见问题

### `npm install` 或 `npm run dev` 报错

请确认你是在仓库根目录执行，而不是进入 `app/src`。

### PowerShell 中 npm 脚本无法运行

如果 PowerShell 提示执行策略受限，可以：

1. 改用 `cmd`
2. 或执行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 大屏没有同步

可以按顺序检查：

1. 确认控制台和大屏都来自同一个站点地址
2. 刷新 `/#/admin` 和 `/#/screen`
3. 重新点击“同步到大屏”
4. 如果仍异常，清除本地缓存后重新打开页面

### 页面状态异常

可以在控制台点击“清除缓存”，或手动删除浏览器 LocalStorage 中的：

```text
poetry-competition-state
```

## 后续建议

- 为 `questions.json` 增加 schema 校验
- 补充最小化回归测试
- 将比赛状态进一步收敛为单一 store
- 增加导出比赛记录能力

## License

仓库包含 [`LICENSE`](/d:/EchoRan/Documents/GitHub/poetry-system/LICENSE) 文件，以该文件内容为准。
