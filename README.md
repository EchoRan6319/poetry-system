# 🏆 传承经典诗词大赛系统

> 面向现场活动的双屏诗词竞赛系统 | 纯前端 · 零后端 · 即插即用

[![Vue](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## ✨ 特色功能

- 🎯 **双屏互动** - 一台电脑同时运行控制台与大屏，主持人操作、选手可见
- ⚡ **纯前端架构** - 无需后端服务器，网络不稳定也能正常运行
- 🔄 **实时同步** - BroadcastChannel 毫秒级状态同步
- 💾 **断电恢复** - LocalStorage 自动保存，刷新页面不丢进度
- 🎨 **数字新国风 UI** - 科技感与传统美学的完美融合
- 📝 **六大题型** - Emoji猜诗、宫格寻诗、易错找茬、中原风华、经典填词、主题飞花令

---

## 🎯 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/EchoRan/poetry-system.git
cd poetry-system

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后打开两个浏览器窗口：

| 角色 | 地址 |
|------|------|
| 🎮 **控制台（主持人）** | http://localhost:5173/#/admin |
| 🖥️ **大屏（选手/观众）** | http://localhost:5173/#/screen |

---

## 📂 项目结构

```
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

---

## 🎮 使用说明

### 控制台功能

控制台页面用于：

- 选择题目
- 同步题目到大屏
- 开始或停止倒计时
- 揭晓答案
- 给队伍加减分（支持负分）
- 添加/减少队伍
- 重置分数
- 重置整场比赛
- **导出比赛记录**（含加分历史）

### 队伍管理

- 默认预设 **3 支队伍**（队伍1、队伍2、队伍3）
- 最多支持 **30 支队伍**
- 点击 `+ 添加` 可自定义队名
- 点击 `- 减少` 删除最后一支队伍
- 分数调整：±10、±20

### 大屏功能

大屏页面用于：

- 展示当前题目
- 展示倒计时
- 展示答案
- 展示实时积分

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 开始或停止倒计时 |
| `Enter` | 揭晓答案 |
| `→` | 下一题 |
| `S` | 同步到大屏 |

---

## 📖 题库数据

题库文件位置：`app/public/questions.json`

每道题包含 7 个字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识符 | `emoji_001` |
| `stage` | 题型分类 | `Emoji 猜诗` |
| `rule` | 规则与限时说明 | `限时 15 秒` |
| `question` | 题目内容 | `🛏️🌙✨，❓⬇️❄️` |
| `answer` | 标准答案 | `床前明月光，疑是地上霜` |
| `key_point` | 主持人提示 | `导播备忘：逐字对应` |
| `time_limit` | 倒计时秒数 | `15` |

```json
{
  "id": "emoji_001",
  "stage": "Emoji 猜诗",
  "rule": "请根据大屏给出的 Emoji 符号，脑洞大开，抢答对应的经典诗句！限时 15 秒。",
  "question": "🛏️🌙✨，❓⬇️❄️",
  "answer": "床前明月光，疑是地上霜",
  "key_point": "导播备忘：🛏️床🌙明月✨光，❓疑⬇️地上❄️霜。逐字对应。",
  "time_limit": 15
}
```

### 六大题型

| 题型 | 描述 | 示例 |
|------|------|------|
| **Emoji 猜诗** | 用表情符号"画"出诗句 | 🛏️🌙✨ → 床前明月光 |
| **宫格寻诗** | 从打乱的汉字中找出诗句 | 大漠孤烟直，长河落日圆 |
| **易错找茬** | 找出古诗中的错别字 | 两个黄**里**鸣翠柳 |
| **中原风华** | 河南地域特色题目 | 杜甫是哪里人？ |
| **经典填词** | 填写诗句中缺失的字 | 春眠不觉晓，处处闻啼_____ |
| **主题飞花令** | 围绕关键字说诗句 | 说出含"月"的诗句 |

---

## 🔄 状态同步与恢复

系统使用两层机制保证现场稳定性：

| 机制 | 作用 |
|------|------|
| `BroadcastChannel` | 同机双窗口实时同步 |
| `LocalStorage` | 状态持久化与异常恢复 |

保存的核心状态包括：

- 当前题目
- 当前阶段
- 队伍分数
- 是否已揭晓答案
- 倒计时状态

> 💡 倒计时使用 `endAt` 时间戳恢复，页面刷新后会按真实经过时间继续计算，不会"停表"。

---

## 🛡️ 技术架构

```
┌─────────────┐         BroadcastChannel         ┌─────────────┐
│   Admin     │ ────────────────────────────────→ │   Screen    │
│  控制台      │ ←─────────────────────────────── │   大屏      │
└──────┬──────┘                                  └──────┬──────┘
       │                                                │
       └──────────────────┬─────────────────────────────┘
                          │
                   LocalStorage
                   状态持久化
```

---

## 🌐 生产构建与部署

### 构建生产版本

```bash
npm run build
```

构建产物位于 `app/dist`。

### GitHub Pages 部署

项目已内置自动化部署工作流，推送到 `main` 分支即可自动构建发布。

**首次启用步骤：**

1. 打开仓库 `Settings`
2. 进入 `Pages`
3. 将 Source 设置为 `GitHub Actions`

**访问地址格式：**

```
https://<用户名>.github.io/<仓库名>/#/admin
https://<用户名>.github.io/<仓库名>/#/screen
```

---

## ❓ 常见问题

### npm install 或 npm run dev 报错

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
3. 重新点击"同步到大屏"
4. 如果仍异常，清除本地缓存后重新打开页面

### 页面状态异常

可以在控制台点击"清除缓存"，或手动删除浏览器 LocalStorage 中的：

```
poetry-competition-admin-state
poetry-competition-screen-state
```

### 如何添加自定义队伍？

在控制台页面点击 `+ 添加` 按钮，输入队名即可。新队伍会自动同步到大屏。

---

## ⚠️ 已知限制

- 更适合同一台机器上的双窗口场景，不适合跨设备联动
- 题库目前是静态 `JSON`，适合活动前编辑，不适合多人在线实时协作
- 没有后端审计日志，误操作主要依赖本地缓存恢复

---

## 🔮 后续建议

- 为 `questions.json` 增加 schema 校验
- 补充最小化回归测试
- 将比赛状态进一步收敛为单一 store

---

## 📄 License

MIT © EchoRan
