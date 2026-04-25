# 修复宫格寻诗题目字数规范

## Why

根据 Screen.vue 中 `gridChars` 的计算逻辑，宫格寻诗组件固定显示 15 个宫格（5×3）。如果 `question` 字段提供的汉字不足 15 个，组件会用空字符串填充剩余宫格。这会导致选手一眼就能看出答案的字数（比如看到 3 个空格就知道答案是 12 个字），严重降低了比赛难度和公平性。

## What Changes

- 检查并修复 **预选赛questions.json** 中所有宫格寻诗题目，确保每道题的 `question` 字段恰好包含 **15 个汉字**
- 检查并修复 **总决赛questions.json** 中所有宫格寻诗题目，确保每道题的 `question` 字段恰好包含 **15 个汉字**
- 每道题只问一小句（五言或七言），通过添加与原诗意境相关或字形相近的干扰字来补足 15 字
- 更新 `key_point` 字段，记录新增的混淆字
- 保持 `answer` 为单句（五言或七言），不扩展为多句答案

## Impact

- Affected specs: 宫格寻诗题型
- Affected code: 预选赛questions.json、总决赛questions.json

## ADDED Requirements

### Requirement: 宫格寻诗题目字数规范
所有宫格寻诗题目的 `question` 字段 SHALL 恰好包含 15 个汉字（以空格分隔）。

#### Scenario: 正常显示
- **WHEN** 系统加载宫格寻诗题目
- **THEN** 大屏上显示 5×3 共 15 个宫格，每个宫格内都有一个汉字，无空白宫格

#### Scenario: 干扰项设计
- **WHEN** 题目答案为五言（5字）或七言（7字）时
- **THEN** 剩余 8-10 个汉字为干扰项，应选自原诗下一句、同作者其他诗句、或字形/意境相近的字
- **AND** 干扰项不应使答案过于明显

## MODIFIED Requirements

无

## REMOVED Requirements

无
