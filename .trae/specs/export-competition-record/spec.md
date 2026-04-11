# 导出比赛记录功能规范

## Why
管理员在比赛结束后无法导出比赛记录（如参赛队伍、每轮题目、得分情况等），不便于存档和复盘。需要提供导出比赛记录为 TXT 文件的能力。

## What Changes
- 在 Admin.vue 管理控制台增加「导出比赛记录」按钮
- 点击后生成包含完整比赛信息的 TXT 文件并触发下载
- 导出内容包括：队伍名称、最终得分、题目列表（含题目内容、答案、揭晓状态）

## Impact
- Affected specs：新增功能
- Affected code：[Admin.vue](file:///d:/EchoRan/Documents/GitHub/poetry-system/app/src/views/Admin.vue)

## ADDED Requirements

### Requirement: 导出比赛记录功能
系统 SHALL 提供将当前比赛记录导出为 TXT 文件下载的能力。

#### Scenario: 正常导出
- **WHEN** 管理员点击「导出比赛记录」按钮
- **THEN** 浏览器触发 TXT 文件下载，文件内容包含所有队伍名称、得分、题目及答案信息

#### Scenario: 空数据导出
- **WHEN** 管理员未进行任何比赛操作（无队伍数据）时点击导出
- **THEN** 仍可导出文件，其中队伍和题目部分显示"暂无数据"

### Requirement: 导出文件命名
导出的 TXT 文件命名格式为：`诗词大赛记录_YYYYMMDD_HHmmss.txt`

### Requirement: 导出文件内容格式
TXT 文件应包含以下结构：
```
========================================
        诗词大赛 - 比赛记录
========================================

--- 队伍得分 ---
1. 队伍1: 100 分
2. 队伍2: 80 分
3. 队伍3: 60 分

--- 题目记录 ---
[第 1 题] 题型：Emoji 猜诗
题目：🌸🍂🐝🌸
答案：春色满园关不住
状态：已揭晓

[第 2 题] 题型：宫格寻诗
题目：春 色 满 园 关 住 不
答案：春色满园关不住
状态：未揭晓
...
```

## MODIFIED Requirements
无

## REMOVED Requirements
无