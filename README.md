# 传承经典诗词大赛系统

面向现场活动的双屏诗词比赛系统。

一个浏览器窗口作为控制台：`/admin`

一个浏览器窗口作为大屏：`/screen`

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
├── package.json              # 根目录 npm 入口
├── package-lock.json
├── README.md
├── src/
│   ├── package.json          # 前端应用配置
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── questions.json    # 题库数据
│   └── src/
│       ├── App.vue
│       ├── main.js
│       ├── style.css
│       ├── utils/
│       │   ├── channel.js    # 双窗口通信
│       │   └── storage.js    # 本地状态持久化
│       └── views/
│           ├── Admin.vue     # 控制台
│           └── Screen.vue    # 大屏端
```

## 环境要求

- Node.js 18+
- npm 9+

建议使用最新版 LTS Node.js。

## 本地启动

在仓库根目录执行：

```bash
npm install
npm run dev
```

启动成功后默认访问：

- 控制台：`http://localhost:5173/admin`
- 大屏：`http://localhost:5173/screen`

如果端口被占用：

```bash
npm run dev -- --port 3000
```

此时访问：

- `http://localhost:3000/admin`
- `http://localhost:3000/screen`

## 构建生产版本

在仓库根目录执行：

```bash
npm run build
```

## 使用说明

### 1. 控制台操作

控制台页面用于：

- 选择题目
- 同步题目到大屏
- 开始/停止倒计时
- 揭晓答案
- 给队伍加减分
- 重置分数
- 重置整场比赛

### 2. 大屏展示

大屏页面用于：

- 展示当前题目
- 展示倒计时
- 展示答案
- 展示实时积分

### 3. 快捷键

控制台支持以下快捷键：

- `Space`：开始/停止倒计时
- `Enter`：揭晓答案
- `ArrowRight`：下一题
- `S`：同步到大屏

## 数据文件

题库文件位置：

[`src/public/questions.json`](/d:/EchoRan/Documents/GitHub/poetry-system/src/public/questions.json)

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

## 当前已知限制

- 适合同一台机器上的双窗口场景，不适合跨机器联动
- 题库目前仍是静态 JSON，适合活动前编辑，不适合多人在线实时编辑
- 没有后端审计日志，误操作只能依赖本地缓存恢复

## 常见问题

### `npm install` 或 `npm run dev` 报错

请先确认你是在仓库根目录执行，而不是进入 `src/src`。

正确目录应包含：

- 根目录 `package.json`
- 根目录 `README.md`

### PowerShell 中 npm 脚本无法运行

如果 PowerShell 提示执行策略限制，可以：

1. 改用 `cmd`
2. 或执行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 大屏没有同步

可按顺序排查：

1. 确认控制台和大屏都来自同一个本地服务地址
2. 刷新 `/admin` 与 `/screen`
3. 重新点击“同步到大屏”
4. 如仍异常，清除本地缓存后重启页面

### 页面异常或状态混乱

可在控制台点击“清除缓存”，或手动删除浏览器 LocalStorage 中的：

```text
poetry-competition-state
```

## 后续建议

如果继续演进这个项目，推荐优先做：

- 为 `questions.json` 增加 schema 校验
- 补充最小化回归测试
- 将比赛状态进一步收敛为单一 store
- 增加“导出比分 / 导出比赛记录”能力

## License

当前仓库已包含 `LICENSE` 文件，按仓库根目录声明为准。
